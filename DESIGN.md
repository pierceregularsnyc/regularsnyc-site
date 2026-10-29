# Regulars NYC: Design

Feeling: clean and premium, like a well-kept neighborhood barbershop with brass fixtures. Deep green and brass, a signage-style serif for headlines, calm light sections. Light mode only.

Direction chosen without reference sites (the UXKIN library was not reachable from the build environment), from Pierce's pick of "clean and premium".

## Color

| Token | Value | Role |
|---|---|---|
| `--green` | `#173b2e` | Brand. Hero, contact band, footer, featured plan, selected states |
| `--green-3` | `#2c5c4a` | Icon strokes, outlines on light backgrounds |
| `--brass` | `#c9a35a` | Primary buttons and the logo. Never for text on light backgrounds |
| `--chalk` | `#f3f4ef` | Page background |
| `--sage` | `#e2e9e3` | Alternate section background, success messages |
| `--white` | `#ffffff` | Cards, plans, phone and booking mockups |
| `--ink` | `#15201b` | Text on light, text on brass buttons |
| `--ink-2` / `--ink-3` | `#4a5550` / `#7c8781` | Secondary text / captions |
| `--on-green` / `--on-green-2` | `#eef2ee` / `#a9bdb2` | Text on green / secondary text on green |
| `--line` | `#d9dfd9` | Borders and dividers |

## Typography

- Headlines, logo, prices, step numbers: **Gloock** (Google Fonts), regular weight only.
- Everything else: **Schibsted Grotesk** 400/500/600.
- Scale: h1 clamp 48 to 90px / 0.98; h2 clamp 32 to 50px / 1.06; h3 18px 600; lead 19px; body 17px / 1.6; small 14px.
- No all-caps labels or eyebrows above headings. Headings say the point in sentence case.

## Spacing and shape

- 8px base. Sections 128px desktop, 104px tablet, 80px phone. Content width 1180px, gutter at least 20px.
- Radius: 999px buttons, 12px small controls, 18 to 22px cards and plans, 40px phone.
- One shadow for raised mockups and the featured plan: `0 2px 4px rgb(10 30 22 / .06), 0 24px 48px -16px rgb(10 30 22 / .28)`.

## Components

- Buttons: brass pill (primary), outline pill on light, ghost pill on green. Focus ring 2px brass.
- Booking widget in the hero is the signature element: a working example (pick a day and time, then book).
- Services use 40px line icons in `--green-3`, 1.6 stroke, no fills.
- Process steps use large brass Gloock numerals because they are a real sequence.

## Imagery

- No stock photos yet. Mockups (booking page, text-back phone, punch card) show the product instead.
- Once clients exist, use their real shop photos. Never fake client work.
