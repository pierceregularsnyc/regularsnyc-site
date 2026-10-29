# Regulars NYC — Design

Feeling: clean and premium. A small, confident studio, not a template. Calm white space, refined type, one deep green used sparingly. Light mode only.

Direction chosen without reference sites (the UXKIN library was not reachable), from Pierce's pick of "clean and premium".

## Color

| Token | Value | Role |
|---|---|---|
| `--bg` | `#f6f6f3` | Page background |
| `--surface` | `#ffffff` | Cards, pricing, phone mockup |
| `--ink` | `#121513` | Headings, body text, primary buttons |
| `--ink-2` | `#4b514d` | Secondary text |
| `--ink-3` | `#8b918d` | Labels, captions, fine print |
| `--line` | `#e2e4df` | Borders and dividers |
| `--green` | `#1f4a38` | Accent: stamps, links, highlights, the contact band |
| `--green-soft` | `#e6eee9` | Tinted backgrounds behind accent elements |

Only one accent. Never use green for body text. Text contrast is 4.5:1 or better on `--bg` and `--surface`.

## Typography

- Family: Hanken Grotesk (Google Fonts), 400/500/600. Fallback: system sans.
- Scale (px / line-height): 13/1.4 label, 15/1.5 small, 17/1.6 body, 20/1.5 lead, 26/1.2 h3, 40/1.08 h2, 72/1.0 h1 (fluid down to 44 on phones).
- Headings: weight 500, letter-spacing -0.035em. No bold-black display type.
- Labels: 13px, weight 500, uppercase, letter-spacing 0.12em, `--ink-3`.
- Body text max 62ch.

## Spacing

8px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144. Sections use 144px on desktop, 88px on phones. Content width 1160px, side gutter at least 20px.

## Shape and depth

- Radius: 8px buttons and inputs, 16px cards, 999px pills.
- One shadow, for raised objects only (punch card, phone, featured plan): `0 1px 2px rgb(18 21 19 / .04), 0 18px 40px -12px rgb(18 21 19 / .12)`.
- Borders are 1px `--line`.

## Components

- Primary button: `--ink` background, white text, 8px radius, 14px/22px padding. Hover lifts to `#000`. Focus: 2px `--green` outline, 3px offset.
- Secondary button: transparent, 1px `--ink` border.
- Text link: `--ink` with a 1px underline offset 4px; hover turns `--green`.
- Cards: `--surface`, 1px `--line`, 16px radius, no shadow.
- Nav: logo left, three links and the primary button right; links hide on phones.

## Imagery

- The hero object is a loyalty punch card (the brand idea: a regular has a stamped card). Stamps are thin `--green` rings.
- Product truth over decoration: a phone mockup shows a real missed-call text-back.
- No stock illustrations, no emoji icons. Real client photos once there are clients.
