// Shared bits for the Regulars NYC pitch mockups:
// a live open/closed line and a small working booking demo.
// Each page puts its hours in <script type="application/json" id="hours">,
// as [open, close] in 24h New York time per day, Sunday first, null = closed.

(function () {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hoursEl = document.getElementById("hours");
  const HOURS = hoursEl ? JSON.parse(hoursEl.textContent) : null;

  function nycNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric",
      year: "numeric", month: "numeric", day: "numeric", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return {
      day: SHORT.indexOf(get("weekday")),
      mins: Number(get("hour")) * 60 + Number(get("minute")),
      date: new Date(Number(get("year")), Number(get("month")) - 1, Number(get("day"))),
    };
  }

  function fmt(h) {
    const whole = Math.floor(h);
    const m = Math.round((h - whole) * 60);
    const suffix = whole >= 12 ? "pm" : "am";
    return (whole % 12 || 12) + (m ? ":" + String(m).padStart(2, "0") : "") + suffix;
  }

  function status() {
    const { day, mins } = nycNow();
    const t = HOURS[day];
    if (t && mins >= t[0] * 60 && mins < t[1] * 60) {
      return { open: true, text: `Open now · until ${fmt(t[1])}` };
    }
    if (t && mins < t[0] * 60) return { open: false, text: `Closed · opens ${fmt(t[0])} today` };
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HOURS[d]) return { open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : DAYS[d]} ${fmt(HOURS[d][0])}` };
    }
    return { open: false, text: "Closed" };
  }

  function renderHours() {
    if (!HOURS) return;
    const s = status();
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", s.open);
      el.querySelector("[data-status-text]").textContent = s.text;
    });
    const table = document.querySelector("[data-hours]");
    if (table) {
      const { day } = nycNow();
      table.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
        const h = HOURS[d];
        return `<tr class="${d === day ? "is-today" : ""}"><th scope="row">${DAYS[d]}</th><td>${h ? `${fmt(h[0])} to ${fmt(h[1])}` : "Closed"}</td></tr>`;
      }).join("");
    }
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* Booking demo: pick a service, a day and a time, then confirm. Nothing is sent. */
  const book = document.querySelector("[data-book]");
  if (!book || !HOURS) return;

  const state = { service: null, day: null, time: null };
  const services = book.querySelectorAll("[data-svc]");
  const daysEl = book.querySelector("[data-days]");
  const timesEl = book.querySelector("[data-times]");
  const confirmBtn = book.querySelector("[data-confirm]");
  const summary = book.querySelector("[data-summary]");
  const done = book.querySelector("[data-done]");

  function openDays() {
    const { date } = nycNow();
    const out = [];
    for (let i = 0; out.length < 6 && i < 14; i++) {
      const d = new Date(date);
      d.setDate(d.getDate() + i);
      if (HOURS[d.getDay()]) out.push(d);
    }
    return out;
  }

  // Fake but steady "taken" slots so the grid looks like a real week.
  function taken(d, h) {
    return ((d.getDate() * 7 + h * 13) % 5) === 0;
  }

  function renderDays() {
    daysEl.innerHTML = openDays().map((d, i) => {
      const label = i === 0 && d.getDate() === nycNow().date.getDate() ? "Today" : SHORT[d.getDay()];
      return `<button type="button" class="day" data-day="${d.toISOString()}" aria-pressed="false"><span>${label}</span><b>${d.getDate()}</b></button>`;
    }).join("");
    daysEl.querySelectorAll(".day").forEach((b) => b.addEventListener("click", () => {
      daysEl.querySelectorAll(".day").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      state.day = new Date(b.dataset.day);
      state.time = null;
      renderTimes();
      update();
    }));
  }

  function renderTimes() {
    if (!state.day) { timesEl.innerHTML = `<p class="hint">Pick a day to see open times.</p>`; return; }
    const [o, c] = HOURS[state.day.getDay()];
    const { date, mins } = nycNow();
    const isToday = state.day.toDateString() === date.toDateString();
    const slots = [];
    for (let h = o; h <= c - 1; h += 1) {
      if (isToday && h * 60 <= mins + 30) continue;
      slots.push(h);
    }
    if (!slots.length) { timesEl.innerHTML = `<p class="hint">No times left today. Try another day.</p>`; return; }
    timesEl.innerHTML = slots.map((h) => {
      const off = taken(state.day, h);
      return `<button type="button" class="time" data-time="${h}" ${off ? "disabled" : ""} aria-pressed="false">${fmt(h)}</button>`;
    }).join("");
    timesEl.querySelectorAll(".time:not([disabled])").forEach((b) => b.addEventListener("click", () => {
      timesEl.querySelectorAll(".time").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      state.time = Number(b.dataset.time);
      update();
    }));
  }

  function update() {
    const ready = state.service && state.day && state.time != null;
    confirmBtn.disabled = !ready;
    if (ready) {
      summary.textContent = `${state.service} · ${DAYS[state.day.getDay()]} ${state.day.getMonth() + 1}/${state.day.getDate()} at ${fmt(state.time)}`;
    } else {
      summary.textContent = !state.service ? "Pick a service" : !state.day ? "Pick a day" : "Pick a time";
    }
  }

  services.forEach((s) => s.addEventListener("click", () => {
    services.forEach((x) => x.setAttribute("aria-pressed", "false"));
    s.setAttribute("aria-pressed", "true");
    state.service = s.dataset.svc;
    update();
  }));

  confirmBtn.addEventListener("click", () => {
    done.querySelector("[data-done-text]").textContent = summary.textContent;
    book.classList.add("is-done");
  });
  book.querySelector("[data-again]").addEventListener("click", () => {
    book.classList.remove("is-done");
  });

  // Any "Book" button on the page can preselect a service and jump to the widget.
  document.querySelectorAll("[data-pick]").forEach((a) => a.addEventListener("click", () => {
    const match = Array.from(services).find((s) => s.dataset.svc === a.dataset.pick);
    if (match) match.click();
  }));

  renderDays();
  renderTimes();
  update();
})();
