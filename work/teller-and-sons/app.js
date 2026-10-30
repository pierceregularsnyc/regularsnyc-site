// Teller & Sons: sample barbershop site by Regulars NYC

// The Cal.com event that every "Book" button opens.
const CAL_LINK = "pierce-regularsnyc.co/haircut-at-teller-sons";
const CAL_URL = "https://cal.com/" + CAL_LINK;

// Opening hours in New York time, 24h. Index 0 is Sunday.
const HOURS = [
  null,
  null,
  [10, 20],
  [10, 20],
  [10, 20],
  [10, 20],
  [9, 18],
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------- Hours and open/closed status ---------- */

function nycNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, mins: Number(get("hour")) * 60 + Number(get("minute")) };
}

function fmtHour(h) {
  const suffix = h >= 12 ? "pm" : "am";
  return (h % 12 || 12) + suffix;
}

function statusNow() {
  const { day, mins } = nycNow();
  const today = HOURS[day];
  if (today) {
    const [open, close] = today;
    if (mins >= open * 60 && mins < close * 60) {
      const left = close * 60 - mins;
      if (left <= 60) return { cls: "is-soon", text: `Open now · closes at ${fmtHour(close)}`, short: `Closes at ${fmtHour(close)}` };
      return { cls: "is-open", text: `Open now · until ${fmtHour(close)} today`, short: `Open until ${fmtHour(close)}` };
    }
    if (mins < open * 60) return { cls: "is-closed", text: `Closed · opens at ${fmtHour(open)} today`, short: `Opens ${fmtHour(open)} today` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (HOURS[d]) {
      const when = i === 1 ? "tomorrow" : DAYS[d];
      return { cls: "is-closed", text: `Closed · opens ${when} at ${fmtHour(HOURS[d][0])}`, short: `Opens ${when} ${fmtHour(HOURS[d][0])}` };
    }
  }
}

function renderHours() {
  const { day } = nycNow();
  const body = document.querySelector("[data-hours]");
  // Start the week on Monday, the way people read shop hours.
  body.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = HOURS[d];
    const cls = [d === day ? "is-today" : "", h ? "" : "is-closed"].join(" ").trim();
    return `<tr class="${cls}"><th scope="row">${DAYS[d]}</th><td>${h ? `${fmtHour(h[0])} to ${fmtHour(h[1])}` : "Closed"}</td></tr>`;
  }).join("");

  const s = statusNow();
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.classList.remove("is-open", "is-soon", "is-closed");
    el.classList.add(s.cls);
    el.querySelector("[data-status-text]").textContent = s.text;
  });
  const short = document.querySelector("[data-status-short]");
  if (short && !document.querySelector(".mobile-book.has-pick")) short.textContent = s.short;
}

renderHours();
setInterval(renderHours, 60 * 1000);

/* ---------- Price card tabs ---------- */

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

/* ---------- Build-your-visit ticket ---------- */

const picked = new Map();
const lines = document.querySelector("[data-lines]");
const ticketBook = document.querySelector("[data-ticket-book]");

function renderTicket() {
  if (!picked.size) {
    lines.innerHTML = '<li class="ticket-empty">Pick a service from the card.</li>';
  } else {
    lines.innerHTML = [...picked.values()]
      .map((s) => `<li><span>${s.name}</span><span>$${s.price}</span></li>`).join("");
  }
  const list = [...picked.values()];
  const mins = list.reduce((a, s) => a + s.min, 0);
  const price = list.reduce((a, s) => a + s.price, 0);
  document.querySelector("[data-total-time]").textContent = mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60 ? (mins % 60) + " min" : ""}`.trim() : `${mins} min`;
  document.querySelector("[data-total-price]").textContent = "$" + price;
  ticketBook.dataset.service = list.map((s) => s.name).join(" + ");
  // On phones the ticket is far below the card, so the bottom bar repeats the total.
  const bar = document.querySelector(".mobile-book");
  bar.classList.toggle("has-pick", picked.size > 0);
  bar.querySelector(".book").dataset.service = ticketBook.dataset.service;
  if (picked.size) bar.querySelector("[data-status-short]").textContent = `${picked.size} ${picked.size === 1 ? "service" : "services"} · $${price}`;
  else renderHours();
}

document.querySelectorAll(".svc").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    if (picked.has(name)) picked.delete(name);
    else picked.set(name, { name, price: Number(btn.dataset.price), min: Number(btn.dataset.min) });
    btn.setAttribute("aria-pressed", picked.has(name));
    renderTicket();
  });
});

document.querySelector("[data-ticket-no]").textContent = "No. " + String(400 + new Date().getDate() * 7).padStart(4, "0");

/* ---------- Reviews ---------- */

const quotes = [...document.querySelectorAll(".quote")];
const qCount = document.querySelector("[data-q-count]");
let q = 0;
let qTimer;
function showQuote(n) {
  quotes[q].classList.remove("is-on");
  q = (n + quotes.length) % quotes.length;
  quotes[q].classList.add("is-on");
  qCount.textContent = `${q + 1} / ${quotes.length}`;
}
function autoplay() {
  clearInterval(qTimer);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) qTimer = setInterval(() => showQuote(q + 1), 7000);
}
document.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { showQuote(q + Number(b.dataset.q)); autoplay(); }));
autoplay();

/* ---------- Booking (Cal.com pop-up, falls back to a new tab) ---------- */

let calReady = false;
(function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const s = d.head.appendChild(d.createElement("script")); s.src = A; s.onload = () => { calReady = true; }; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#b3202a" } }, hideEventTypeDetails: false, layout: "month_view" });

document.querySelectorAll(".book").forEach((a) => {
  a.href = CAL_URL;
  a.target = "_blank";
  a.rel = "noopener";
  a.addEventListener("click", (e) => {
    const service = a.dataset.service;
    const notes = service ? (service.startsWith("with ") ? `Barber: ${service.slice(5)}` : `Services: ${service}`) : "";
    if (!calReady) {
      if (notes) a.href = `${CAL_URL}?notes=${encodeURIComponent(notes)}`;
      return; // let the link open Cal.com in a new tab
    }
    e.preventDefault();
    Cal("modal", { calLink: CAL_LINK, config: { layout: "month_view", ...(notes ? { notes } : {}) } });
  });
});
