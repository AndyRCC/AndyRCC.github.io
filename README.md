# Andy Casafranca — Design System

Personal-website design system distilled from **AndyRCC.github.io** — Andy Ricardo Casafranca Carrascal's portfolio site, hosted on GitHub Pages.

Andy is a Mechatronics Engineering student from Lima, Perú. The site reads as a personal, slightly playful introduction: engineering work, F1 fandom, gaming, and a McLaren-papaya favicon as a visual signature. The user wants the design system to feel **modern, interactive, a little shocking, and a little funny** — pushing the existing brand into territory that looks like "diseñada por expertos de altísimo nivel".

## Sources

| Source | Path / link |
|---|---|
| Codebase | `AndyRCC/AndyRCC.github.io` (GitHub) — `index.html`, `css/style.css`, `css/style-liberty.css`, `css/main.css` |
| Live site | https://andyrcc.github.io/ |
| Favicon | `images/mclaren.png` (McLaren F1 logo, papaya orange) |
| LinkedIn | linkedin.com/in/andy-ricardo-casafranca-carrascal-215982115 |
| Instagram | instagram.com/andy_rcc |
| YouTube | youtube.com/@Andy_Casafranca |
| GitHub | github.com/AndyRCC |
| Steam | steamcommunity.com/id/hitheads |

The original site is a WordPress "UI Portfolio" theme (W3layouts) exported to static HTML, then customized with Andy's content. The design tokens here come from reading the actual source CSS — variable names like `--primary-color`, `--heading-color`, `--font-color`, `--bg-color`, `--bg-grey`, `--border-color-light`, `--border-radius`, `--border-radius-full` are kept verbatim so the system stays drop-in compatible.

## Content fundamentals

**Tone.** Warm, first-person, mildly cheeky. Andy writes in English on the public surface, with occasional Spanish ("Lima, Perú"). Section headings deliberately drop to lowercase to feel personal — *"some things i do"*, *"some projects ツ"*. Bigger structural headings (hero, about) use sentence case with title weight: *"Hi, I'm Andy Casafranca"*, *"My Featured skills"*.

**I vs you.** First-person dominant. The hero opens *"Hi, I'm Andy Casafranca"* and the about copy is *"I am a Mechatronics Engineering student who thrives at..."*. The site speaks AT the visitor only in CTAs ("Contact Me").

**Emoji & glyphs.** Sparingly used, but loadbearing when they show up:
- *"some projects ツ"* — kaomoji as a visual punctuation mark
- 🏆, 🔧, 🚨 in the portfolio cards
- A typing-cursor ghost glyph in the hero subhead

**Vibe.** "Engineer who also has a soul." Specific examples that capture it:

> "I'm passionate about creating, exploring, and moving—whether it's through engineering challenges, road trips, fast cars, or quiet moments by the ocean."

> "Mechatronics Engineering student who thrives at the chaotic intersection of mechanics, electronics, and intelligent systems."

> "I'm just as comfortable debugging a circuit board as I am polishing a user interface."

The voice mixes precise engineering nouns (*microcontroller, sensor integration, control algorithms, biomedical instrumentation*) with romantic verbs (*thrives, passionate, driven, satisfying challenge*).

## Visual foundations

**Color.** Primary is a confident teal `#0aa697` (used for links, buttons, focus, hover, and the gradient menu toggle). Hover/press deepens to `#025b4d`. Grays follow Bootstrap 5: `#f8f9fa` lightgrey backgrounds, `#212529` darks, `#404040` body copy. McLaren **papaya orange `#ff8000`** is a brand-signature accent — currently only the favicon, but it's pulled forward in this system as the "shocking / fun" lever the user asked for. F1 yellow `#ffc107` and danger red `#dc3545` round out the accent set.

**Type.** DM Sans is the workhorse (400 / 500 / 700) for both headings and body. Dosis (300 → 800) shows up in the nav/branding voice. Headings are bold (700) with slight negative tracking; small eyebrows are uppercase, 2-letter-spaced. Body uses 1px positive letter-spacing on long-form (`p.about`, line-height 1.9). Font Awesome 6 supplies all icons.

**Spacing.** WordPress preset scale: 0.44 / 0.67 / 1 / 1.5 / 2.25 / 3.38 / 5.06 rem. Sections use heavy vertical rhythm — `py-5` on top of `py-md-5` is the standard sandwich, giving big section breathers.

**Backgrounds.** Mostly flat white / `#f8f9fa` alternation. The hero overlays a photographic background (`banner1.jpg`, faded under the headline). No repeating patterns. No hand-drawn illustrations. The brand has a 3D-decal vibe waiting to be unlocked — the McLaren mark is the only ornament — so this system introduces optional **3D / glassy / shocking** treatments (perspective cards, magnetic hovers, tilt) explicitly flagged as new.

**Animation.** Slow + smooth: `transition: 0.5s all` is the global default on `<a>` and `<button>`. Easing is the browser default (ease). Specific animations from source: typed-text terminal effect in the hero (200ms typing, 10ms erase), counter count-up on stats, owl carousel auto-scroll on logos, prettyPhoto image zoom. No bounces, no spring physics.

**Hover states.** Color-shift to `var(--primary-color)`. For tag pills + page numbers, hover *inverts* — fill becomes primary, text becomes white, border matches. Underline on `<a>` is the default; underline drops on hover.

**Press states.** `input#submit:hover { background-color: #025b4d }` — pure color darken, no scale or shadow change.

**Borders.** 1px, `var(--border-color-light)` (`#e6e8eb`). Radii: `8px` default, `4px` for tight inputs, `50px` for pill / fully-rounded buttons + tag chips.

**Shadows.** Subtle: `0 25px 98px 0 rgba(19, 19, 19, .03)` on pagination, `0 0 20px rgba(51, 51, 51, .1)` on course-detail cards. The WP preset library also gives us "crisp" `6px 6px 0 rgba(0,0,0,1)` and "sharp" `6px 6px 0 rgba(0,0,0,.2)` — I've kept these as opt-in shock-shadow tokens since they fit the user's "shocking" request.

**Transparency / blur.** None in source. Fixed header is opaque white with a thin border. Glass / backdrop-filter is *new* territory introduced here for the "modern 3D" requirement.

**Layout rules.** Bootstrap 5 grid (12-col), max-widths 540 / 720 / 960 / 1140 / 1320. Fixed top header (`#site-header.fixed-top`). Section padding: `py-5` (3rem vertical). Hero uses 7/5 split (text/photo). Portfolio uses 3-column grid with overlay-on-hover pattern.

**Imagery.** Cool / neutral photography. The hero portrait is a cutout PNG of Andy in front of a windowed building. The "about" photo is the same tone — overcast, no grain, no filter. Logo carousel is plain white-on-white grayscale brand marks.

**Cards.** White background, 1px light border, 8px radius, subtle large-blur shadow. The portfolio's image-cards have a darken-overlay reveal on hover that brings up the title + description.

## Iconography

**Source library.** Font Awesome 6 Free (CDN: `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0`) — solid + brand variants. The site self-hosts the woff2 fallbacks but loads the icons via the FA classnames (`fa-code`, `fa-microchip`, `fa-brain`, `fab fa-linkedin-in`, etc).

**Substitution flag.** The original repo bundles FA 5.x font files locally. I'm linking FA 6.5 from CDN here (no flag — it's what the site itself ships). If the user wants pixel parity, drop the locally-hosted v5 woff2s into `fonts/` and we'll switch.

**Service / about icons** — solid Font Awesome:
- `fas fa-code` — Ethical Hacking & Penetration Testing
- `fas fa-microchip` — Embedded Systems & Automation
- `fa-solid fa-brain` — Bioengineering & Instrumentation
- `fab fa-asymmetrik` — the navbar brand glyph (yes, really)

**Social** — Font Awesome brands: `fa-linkedin-in`, `fa-instagram`, `fa-steam`, `fa-youtube`, `fa-github`.

**Theme toggle** — uses `css.gg` glyphs (`gg-sun`, `gg-moon`).

**Emoji.** Used as decoration in section headers (`ツ`) and as content punctuation in portfolio card titles (🏆, 🔧, 🚨). Unicode chars beyond emoji aren't used.

**Custom marks.** The favicon is `images/mclaren.png` — the official McLaren F1 logo cropped and resized. This is the brand's only proprietary visual mark and is treated as the personal seal.

## File index

```
README.md                       this file
SKILL.md                        Agent-Skill manifest
colors_and_type.css             all design tokens (light + dark)

assets/                         images & logos pulled from the repo
  banner.png                    hero portrait cutout
  banner-bg.jpg                 hero photographic backdrop
  about.jpg                     about-section photo
  mclaren.png                   favicon / brand seal
  blog1.jpg, blog2.jpg          portfolio thumbnails
  first.jpg, second.jpg         portfolio full-size
  title-bg-1.svg, title-bg-2.svg  decorative title backings
  logo1.png, logo2.png, logo3.png  client-logo placeholders

preview/                        small spec cards for the Design System tab
  *.html                        one card per concept (~700×150)

ui_kits/personal-site/          high-fidelity recreation
  README.md
  index.html                    interactive portfolio prototype
  Header.jsx, Hero.jsx, About.jsx, Services.jsx,
  Portfolio.jsx, ThreeDFlourish.jsx, ThemeToggle.jsx
```

## Index / manifest

Root files
- `README.md` — this document
- `SKILL.md` — Agent-Skill manifest (drop-in for Claude Code)
- `colors_and_type.css` — all design tokens (light + dark)

Folders
- `assets/` — logos, banner photos, portrait cutouts, McLaren brand seal
- `preview/` — 17 small spec cards rendered in the Design System tab (colors, type, spacing, components, brand)
- `ui_kits/personal-site/` — full hi-fi React recreation with Foundation / Modern / Shocking intensity modes

UI kits
- **personal-site** — `ui_kits/personal-site/index.html`. Components: `Header`, `Hero`, `MarqueeRibbon`, `About`, `Services`, `Portfolio`, `Contact`, `ThreeDFlourish`, `Footer`, `CursorHalo`. Tweaks panel toggles intensity mode, individual effects, and brand colors live.

## Tweak knobs the user asked for

The user wants **modern + interactive + shocking + a little funny + 3D**. To honor the existing brand (DM Sans, teal, photography-led) AND deliver that, the system layers three optional "intensity" modes on top of the foundation:

1. **Foundation** — the actual brand. Looks like the existing site, just sharper.
2. **Modern** — adds glass cards, perspective hovers, magnetic buttons, dark-mode polish.
3. **Shocking** — turns on 3D-tilted hero portrait, papaya-orange shock shadows (WP "crisp" preset), exaggerated cursor effects, marquee-style ribbons.

The UI kit demonstrates all three so the user can pick which dial to turn.
