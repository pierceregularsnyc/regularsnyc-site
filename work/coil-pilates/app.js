// Coil Pilates: sample Pilates studio site by Regulars NYC

// The Cal.com event that every "Book" button opens.
const CAL_LINK = "pierce-regularsnyc.co/reformer-class-at-coil";
const CAL_URL = "https://cal.com/" + CAL_LINK;

const CLASSES = {
  found: { name: "Foundations", level: 1, min: 50, img: "foundations", load: "Light springs", tag: "Start here",
    desc: "Every move on the reformer, taught slowly. Footwork, the hundred, short box. You'll leave knowing how to set your own springs.",
    good: "it's your first time, or your first time in a while." },
  flow: { name: "Reformer Flow", level: 2, min: 50, img: "flow", load: "Medium springs", tag: "Most booked",
    desc: "The full-body class most people stay for. One move rolls into the next, so your core never gets a break.",
    good: "you've done a few classes and want the classic workout." },
  tower: { name: "Tower Strength", level: 3, min: 50, img: "tower-class", load: "Heavy springs", tag: "Heavy springs",
    desc: "Half on the reformer, half on the tower with push-through bars and leg springs. Slow, heavy, and very honest.",
    good: "you lift, or want the strength without the weights." },
  burn: { name: "Jump Board Burn", level: 3, min: 45, img: "burn", load: "Medium to heavy", tag: "Cardio",
    desc: "A padded board goes on the end of the reformer and you jump lying down. Real cardio, no pounding on your knees.",
    good: "you miss running but your joints don't." },
  slow: { name: "Slow Springs", level: 1, min: 45, img: "stretch", load: "Light springs", tag: "Stretch & reset",
    desc: "Long holds, deep stretches and breathing. The springs help you open up instead of fighting you.",
    good: "you sit at a desk all day, or ran yesterday." },
};
const COACHES = { ines: "Inès", tess: "Tess", june: "June" };
const CAPACITY = 12;

// Weekly timetable. Index 0 is Sunday. [start "HH:MM", class, instructor]
const WEEK = [
  [["08:30", "flow", "ines"], ["10:00", "found", "june"], ["11:30", "slow", "tess"], ["13:00", "tower", "ines"]],
  [["06:30", "burn", "tess"], ["07:45", "flow", "ines"], ["12:15", "found", "june"], ["17:30", "tower", "ines"], ["18:45", "flow", "tess"], ["20:00", "slow", "june"]],
  [["06:30", "flow", "ines"], ["07:15", "burn", "tess"], ["12:15", "slow", "june"], ["17:30", "found", "june"], ["18:45", "tower", "tess"], ["20:00", "flow", "ines"]],
  [["06:30", "tower", "ines"], ["07:45", "flow", "tess"], ["12:15", "flow", "june"], ["17:30", "burn", "tess"], ["18:45", "flow", "ines"], ["20:00", "found", "june"]],
  [["06:30", "burn", "tess"], ["07:45", "found", "june"], ["12:15", "tower", "ines"], ["17:30", "flow", "ines"], ["18:45", "burn", "tess"], ["20:00", "slow", "june"]],
  [["06:30", "flow", "ines"], ["07:15", "burn", "tess"], ["12:15", "found", "june"], ["17:30", "flow", "tess"], ["18:45", "slow", "ines"]],
  [["08:00", "burn", "tess"], ["09:15", "flow", "ines"], ["10:30", "found", "june"], ["12:00", "tower", "ines"], ["13:15", "slow", "june"]],
];
// Front desk hours, index 0 is Sunday.
const HOURS = [[8, 14.5], [6, 21], [6, 21], [6, 21], [6, 21], [6, 20], [7.5, 14.5]];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------- New York time ---------- */

function nycNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  // A plain calendar date (no time zone math needed after this).
  const date = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
  return { date, mins: get("hour") * 60 + get("minute") };
}
function addDays(d, n) { return new Date(d.getTime() + n * 864e5); }
function toMins(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function fmtTime(t) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
}
function fmtHour(x) {
  const h = Math.floor(x), m = Math.round((x - h) * 60);
  return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""}${h >= 12 ? "pm" : "am"}`;
}

// Made-up but steady seat counts: the same class always shows the same number,
// evenings and early mornings fill up, and classes fill as they get closer.
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
function booked(date, start, type, daysOut) {
  const m = toMins(start);
  let base = 4 + hash(date.toISOString().slice(0, 10) + start) * 5;
  if (m < 8 * 60 || m >= 17 * 60) base += 3;
  if (date.getUTCDay() === 0 || date.getUTCDay() === 6) base += 2;
  if (type === "burn") base += 1.5;
  base -= daysOut * 1.1;
  return Math.max(1, Math.min(CAPACITY, Math.round(base)));
}

function classesOn(offset, now) {
  const date = addDays(now.date, offset);
  return WEEK[date.getUTCDay()].map(([start, type, who]) => {
    const taken = booked(date, start, type, offset);
    return { date, offset, start, type, who, taken, left: CAPACITY - taken, past: offset === 0 && toMins(start) <= now.mins };
  });
}
function dayLabel(c, long) {
  if (c.offset === 0) return "Today";
  if (c.offset === 1) return "Tomorrow";
  const d = c.date;
  return long ? `${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}` : DAYS[d.getUTCDay()].slice(0, 3);
}
function noteFor(c) {
  const d = c.date;
  return `Class: ${CLASSES[c.type].name}, ${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} at ${fmtTime(c.start)} with ${COACHES[c.who]}`;
}

/* ---------- Hero: open now + next class ---------- */

function renderHero() {
  const now = nycNow();
  const dow = now.date.getUTCDay();
  const [o, cl] = HOURS[dow];
  const kicker = document.querySelector(".kicker");
  const open = now.mins >= o * 60 && now.mins < cl * 60;
  kicker.classList.toggle("is-open", open);
  kicker.querySelector("[data-open-text]").textContent = open
    ? `Open now · desk until ${fmtHour(cl)}`
    : `Closed now · opens ${now.mins < o * 60 ? "today" : "tomorrow"} at ${fmtHour(now.mins < o * 60 ? o : HOURS[(dow + 1) % 7][0])}`;

  let next;
  for (let i = 0; i < 7 && !next; i++) next = classesOn(i, now).find((c) => !c.past && c.left > 0);
  if (!next) return;
  const k = CLASSES[next.type];
  document.querySelector("[data-next-when]").textContent = `Next open class · ${dayLabel(next, true)}, ${fmtTime(next.start)}`;
  document.querySelector("[data-next-name]").textContent = k.name;
  document.querySelector("[data-next-meta]").textContent = `With ${COACHES[next.who]} · ${k.min} min · ${k.load.toLowerCase()}`;
  document.querySelector("[data-next-seats]").innerHTML = Array.from({ length: CAPACITY }, (_, i) => `<i class="${i < next.taken ? "taken" : "free"}"></i>`).join("");
  document.querySelector("[data-next-left]").textContent = `${next.left} of ${CAPACITY} reformers free`;
  document.querySelector("[data-next-book]").dataset.note = noteFor(next);
}

/* ---------- Weekly schedule ---------- */

const state = { day: 0, type: "all", who: "all" };
const daysEl = document.querySelector("[data-days]");
const slotsEl = document.querySelector("[data-slots]");

function renderDays() {
  const now = nycNow();
  daysEl.innerHTML = Array.from({ length: 7 }, (_, i) => {
    const list = classesOn(i, now).filter((c) => !c.past);
    const d = addDays(now.date, i);
    const name = i === 0 ? "Today" : DAYS[d.getUTCDay()].slice(0, 3);
    return `<button class="day" role="tab" aria-selected="${i === state.day}" tabindex="${i === state.day ? 0 : -1}" data-day="${i}">
      <span class="d-name">${name}</span><span class="d-num">${d.getUTCDate()}</span><span class="d-count">${list.length} ${i === 0 ? "left" : list.length === 1 ? "class" : "classes"}</span></button>`;
  }).join("");
}

function renderSlots() {
  const now = nycNow();
  const list = classesOn(state.day, now).filter((c) => (state.type === "all" || c.type === state.type) && (state.who === "all" || c.who === state.who));
  if (!list.length) {
    const who = state.who !== "all" ? ` with ${COACHES[state.who]}` : "";
    const what = state.type !== "all" ? CLASSES[state.type].name : "classes";
    slotsEl.innerHTML = `<li class="slots-empty">No ${what}${who} on this day. Try another day above.</li>`;
    return;
  }
  slotsEl.innerHTML = list.map((c, i) => {
    const k = CLASSES[c.type];
    const end = toMins(c.start) + k.min;
    const endT = `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
    const cls = ["slot", c.past ? "is-past" : "", c.left === 0 ? "is-full" : "", c.left > 0 && c.left <= 3 ? "is-low" : ""].join(" ");
    const spots = c.past ? "Already started" : c.left === 0 ? "Full · waitlist open" : c.left === 1 ? "Last reformer" : `${c.left} spots left`;
    const btn = c.past ? "Done" : c.left === 0 ? "Join waitlist" : "Reserve";
    const note = (c.left === 0 ? "Waitlist. " : "") + noteFor(c);
    return `<li class="${cls}" style="animation-delay:${i * 40}ms">
      <p class="s-time" style="margin:0">${fmtTime(c.start)}<small>to ${fmtTime(endT)}</small></p>
      <div><div class="s-name">${k.name}</div>
        <div class="s-sub"><img class="s-avatar" src="photos/face-${c.who}.webp" alt="">${COACHES[c.who]}
          <span class="meter" data-l="${k.level}" title="${k.load}" aria-label="${k.load}"><i></i><i></i><i></i></span></div></div>
      <div class="s-cap"><div class="s-spots">${spots}</div><div class="s-bar"><span style="width:${(c.taken / CAPACITY) * 100}%"></span></div></div>
      <div class="s-act"><a class="s-btn book" href="#" data-note="${note.replace(/"/g, "&quot;")}" ${c.past ? 'aria-disabled="true" tabindex="-1"' : ""}>${btn}</a></div>
    </li>`;
  }).join("");
  wireBooking(slotsEl);
}

daysEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-day]");
  if (!b) return;
  state.day = Number(b.dataset.day);
  renderDays(); renderSlots();
  daysEl.querySelector(`[data-day="${state.day}"]`).focus();
});
daysEl.addEventListener("keydown", (e) => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (!step) return;
  state.day = (state.day + step + 7) % 7;
  renderDays(); renderSlots();
  daysEl.querySelector(`[data-day="${state.day}"]`).focus();
});

function setType(type) {
  state.type = type;
  document.querySelectorAll("[data-type]").forEach((c) => c.setAttribute("aria-pressed", c.dataset.type === type));
  renderSlots();
}
document.querySelectorAll("[data-type]").forEach((c) => c.addEventListener("click", () => setType(c.dataset.type)));
const whoSel = document.querySelector("[data-who]");
whoSel.addEventListener("change", () => { state.who = whoSel.value; renderSlots(); });

// Jump to the schedule on the first day that has a matching class.
function showInSchedule({ type = "all", who = "all" }) {
  state.who = who; whoSel.value = who;
  const now = nycNow();
  for (let i = 0; i < 7; i++) {
    if (classesOn(i, now).some((c) => !c.past && (type === "all" || c.type === type) && (who === "all" || c.who === who))) { state.day = i; break; }
  }
  renderDays();
  setType(type);
  document.getElementById("schedule").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
document.querySelectorAll("[data-coach]").forEach((b) => b.addEventListener("click", () => showInSchedule({ who: b.dataset.coach })));

/* ---------- Class explorer ---------- */

const classTabs = [...document.querySelectorAll("[data-class]")];
const view = document.querySelector("[data-class-view]");
let currentClass = "found";
function selectClass(tab, focus) {
  const key = tab.dataset.class;
  classTabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
  if (focus) tab.focus();
  if (key === currentClass) return;
  currentClass = key;
  const k = CLASSES[key];
  view.classList.add("is-swap");
  setTimeout(() => {
    const img = view.querySelector("[data-cv-img]");
    img.src = `photos/${k.img}.webp`;
    img.alt = `${k.name} class on the reformer`;
    view.querySelector("[data-cv-name]").textContent = k.name;
    view.querySelector("[data-cv-desc]").textContent = k.desc;
    view.querySelector("[data-cv-good]").textContent = k.good;
    view.querySelector("[data-cv-load]").textContent = k.load;
    view.querySelector("[data-cv-min]").textContent = `${k.min} min`;
    const meter = view.querySelector("[data-cv-meter]");
    meter.dataset.l = k.level;
    meter.setAttribute("aria-label", `Spring load: ${k.load.toLowerCase()}`);
    view.querySelector("[data-cv-times]").textContent = `See ${k.name} times`;
    const done = () => view.classList.remove("is-swap");
    img.complete ? requestAnimationFrame(done) : (img.onload = done);
  }, 180);
}
classTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectClass(tab));
  tab.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover)").matches) selectClass(tab); });
  tab.addEventListener("keydown", (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    selectClass(classTabs[(i + step + classTabs.length) % classTabs.length], true);
  });
});
view.querySelector("[data-cv-meter]").dataset.l = 1;
view.querySelector("[data-cv-img]").alt = "Foundations class: a client sits upright on the reformer holding the straps";
view.querySelector("[data-cv-times]").addEventListener("click", () => showInSchedule({ type: currentClass }));
// Preload the other class photos so switching feels instant.
Object.values(CLASSES).forEach((k) => { const i = new Image(); i.src = `photos/${k.img}.webp`; });

/* ---------- Pack calculator ---------- */

const freq = document.querySelector("[data-freq]");
const WEEKS = 4.33;
function renderCalc() {
  const n = Number(freq.value);
  const perMonth = n * WEEKS;
  const cost = { drop: perMonth * 38, pack: perMonth * 32, unl: 269 };
  const best = Object.keys(cost).reduce((a, b) => (cost[b] < cost[a] ? b : a));
  const max = Math.max(...Object.values(cost));
  document.querySelectorAll("[data-plan]").forEach((p) => {
    const key = p.dataset.plan;
    p.classList.toggle("is-best", key === best);
    p.querySelector("[data-month]").textContent = "$" + Math.round(cost[key]);
    p.querySelector(".plan-bar span").style.setProperty("--h", `${Math.max(8, (cost[key] / max) * 100)}%`);
  });
  document.querySelector("[data-freq-out]").textContent = n;
  freq.style.setProperty("--p", `${((n - 1) / 5) * 100}%`);
  const save = Math.round(cost.drop - cost[best]);
  const names = { pack: "a 10-class pack", unl: "Unlimited" };
  const perClass = Math.round(cost[best] / perMonth);
  document.querySelector("[data-calc-sum]").innerHTML = best === "drop"
    ? `At ${n} a week, drop-ins are cheapest.`
    : `At ${n} a week, ${names[best]} saves you <b>$${save} a month</b> over drop-ins. That's about $${perClass} a class.`;
}
freq.addEventListener("input", renderCalc);

/* ---------- Hours table ---------- */

function renderHours() {
  const dow = nycNow().date.getUTCDay();
  document.querySelector("[data-hours]").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const [o, c] = HOURS[d];
    return `<tr class="${d === dow ? "is-today" : ""}"><th scope="row">${DAYS[d]}</th><td>${fmtHour(o)} to ${fmtHour(c)}</td></tr>`;
  }).join("");
}

/* ---------- Scroll effects: the hero spring stretches, the closing coil draws ---------- */

const rule = document.querySelector(".spring-rule");
const closer = document.querySelector(".closer");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;
function onScroll() {
  ticking = false;
  const vh = innerHeight;
  const stretch = Math.min(1, Math.max(0, scrollY / (vh * 0.6)));
  rule.style.setProperty("--stretch", stretch.toFixed(3));
  const r = closer.getBoundingClientRect();
  const draw = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.2)));
  closer.style.setProperty("--draw", draw.toFixed(3));
}
if (!reduce) {
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
} else {
  rule.style.setProperty("--stretch", 1);
  closer.style.setProperty("--draw", 1);
}

// Repeat the photo strip so its slow drift loops without a gap.
const track = document.querySelector(".strip-track");
[...track.children].forEach((f) => { const c = f.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.querySelector("img").alt = ""; track.appendChild(c); });

/* ---------- Booking (Cal.com pop-up, falls back to a new tab) ---------- */

let calReady = false;
(function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const s = d.head.appendChild(d.createElement("script")); s.src = A; s.onload = () => { calReady = true; }; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#2a1330" } }, hideEventTypeDetails: false, layout: "month_view" });

function wireBooking(root) {
  root.querySelectorAll(".book").forEach((a) => {
    if (a.dataset.wired) return;
    a.dataset.wired = "1";
    a.href = CAL_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", (e) => {
      const notes = a.dataset.note || "";
      if (!calReady) {
        a.href = notes ? `${CAL_URL}?notes=${encodeURIComponent(notes)}` : CAL_URL;
        return; // let the link open Cal.com in a new tab
      }
      e.preventDefault();
      Cal("modal", { calLink: CAL_LINK, config: { layout: "month_view", ...(notes ? { notes } : {}) } });
    });
  });
}

/* ---------- Start ---------- */

function tick() { renderHero(); renderHours(); renderDays(); renderSlots(); }
tick();
renderCalc();
wireBooking(document);
setInterval(() => { renderHero(); renderHours(); renderSlots(); }, 60 * 1000);
