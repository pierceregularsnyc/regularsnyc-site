# Regulars NYC: Design

Feeling: clean and premium. White, black, and one cobalt blue, a sharp serif for headlines, calm light sections. Light mode only.

Direction chosen without reference sites (the UXKIN library was not reachable from the build environment), from Pierce's pick of "clean and premium".

## Color

| Token | Value | Role |
|---|---|---|
| `--accent` | `#2747e8` | Cobalt. Primary buttons, links, logo, step numbers. The only color |
| `--accent-2` | `#1d38c4` | Button hover, success text |
| `--dark` | `#0f1217` | Featured plan, contact band, footer, selected states |
| `--white` | `#ffffff` | Hero, cards, plans, mockups |
| `--chalk` | `#f7f7f8` | Page background |
| `--sage` | `#eef1fd` | Light blue tint: alternate section, success messages |
| `--ink` / `--ink-2` / `--ink-3` | `#0f1217` / `#4a4f5a` / `#7d828d` | Text, secondary text, captions |
| `--on-dark` / `--on-dark-2` | `#f4f5f7` / `#a3a8b3` | Text on dark |
| `--line` | `#e3e5ea` | Borders and dividers |

## Typography

- Headlines, logo, prices, step numbers: **Gloock** (Google Fonts), regular weight only.
- Everything else: **Schibsted Grotesk** 400/500/600.
- Scale: h1 clamp 48 to 90px / 0.98; h2 clamp 32 to 50px / 1.06; h3 18px 600; lead 19px; body 17px / 1.6; small 14px.
- No all-caps labels or eyebrows above headings. Headings say the point in sentence case.

## Spacing and shape

- 8px base. Sections 128px desktop, 104px tablet, 80px phone. Content width 1180px, gutter at least 20px.
- Radius: 999px buttons, 12px small controls, 18 to 22px cards and plans, 40px phone.
- One shadow for raised mockups and the featured plan: `0 2px 4px rgb(15 18 30 / .06), 0 24px 48px -16px rgb(15 18 30 / .28)`.

## Components

- Buttons: cobalt pill (primary), outline pill on light, ghost pill on white. Focus ring 2px cobalt.
- Booking widget in the hero is the signature element: a working example (pick a day and time, then book), with two floating notification chips.
- Before/after: two browser windows (a 1998-style site vs a clean one) for a made-up shop, always labeled as an example. A Desktop/Phone toggle reshapes the frame into a phone; the old site never reflows and just scales down, the new one reflows via container queries. A one-time sweep hints that the handle drags, and a Before/After table below dims whichever side the handle hides.
- Scroll story: a sticky phone follows one customer through find, book, reminder, come back. On desktop it sits beside the steps; on tablet and phone it sticks to the top of the screen while the steps scroll underneath.
- Hero background: a canvas of Manhattan's street grid (tilted 29 degrees, avenues wide apart, streets close), with cobalt pulses that land as booking pings. Fades out under the headline; still image when reduced motion is on; paused off screen.
- Services: accessible tabs (arrow keys work) beside a white "owner view" window that shows each tool from the shop's side: site plus text-to-update thread, week calendar, reminder log, missed-call timeline, review requests. All names in it are examples, and the page says so.
- Missed-call calculator: two sliders (calls missed a week, average visit price) give a yearly figure using only the visitor's numbers, compared with the real first-year cost of Site + Booking ($1,000).
- Booking confirmation draws a cobalt check. Footer ends with an outlined Gloock "Regulars." wordmark.
- Service tabs use 32px line icons, 1.6 stroke, no fills; grey when inactive, cobalt when selected.
- Process steps use large cobalt Gloock numerals because they are a real sequence.

## Imagery

- No stock photos yet. Mockups (booking page, text-back phone, punch card) show the product instead.
- Once clients exist, use their real shop photos. Never fake client work.
