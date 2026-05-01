# Personal-site UI kit

Hi-fi recreation of **andyrcc.github.io** — pulls structure, content, and visual tokens from the original WordPress-export source, then layers the user's three "intensity" dials on top:

1. **Foundation** — the existing brand. DM Sans, teal primary, photo-led hero.
2. **Modern** — glass cards, magnetic hover, dark-mode toggle, spring-y button presses.
3. **Shocking / 3D** — perspective-tilted hero portrait, papaya-orange shock shadows, parallax background, oversized marquee ribbon, cursor halo.

Tweaks panel toggles each dial independently.

## Components
- `Header.jsx` — fixed top nav, theme toggle, mobile-friendly burger
- `Hero.jsx` — split layout, typed-text effect, optional 3D-tilt portrait, parallax bg
- `MarqueeRibbon.jsx` — papaya-orange shock band ("MECHATRONICS · F1 · EMBEDDED · HACKING ·")
- `About.jsx` — counter stats + portrait
- `Services.jsx` — three icon cards (Embedded / Hacking / Bioengineering)
- `Portfolio.jsx` — filter pills + image-overlay grid
- `Contact.jsx` — form + social rail
- `Footer.jsx`
- `ThreeDFlourish.jsx` — pure-CSS 3D scene (rotating wireframe + papaya orb), the "shocking" delight
- `useTilt.jsx`, `useTyped.jsx`, `useTweaks.jsx` — small hooks

## Files
- `index.html` — interactive demo, mounts the full single-page experience
