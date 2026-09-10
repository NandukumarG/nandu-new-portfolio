# Nandu — developer portfolio

A responsive React and Vite portfolio with a dark forest and acid-lime visual system, locally hosted DM Sans and Instrument Serif fonts, and a live Three.js system model.

## Run locally

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
npm run lint
```

## Personalize

- Update the biography, project concepts, technologies, and availability in `src/Portfolio.jsx`.
- The three sample projects are explicitly labeled as concepts. Replace their descriptions and architecture notes with your actual work before publishing.
- Copy `.env.example` to `.env.local` and set `VITE_CONTACT_EMAIL` to your address. The contact form then prepares a draft in the visitor's email app. Without an address, it copies a project brief to the clipboard and clearly states that no message was sent. No backend or form service is configured.
- Edit colors, type, and global rules in `src/index.css`, and section layouts in `src/portfolio.css`.
- Font files and their SIL Open Font Licenses are in `public/fonts`. There are no remote font dependencies.
- The favicon and page metadata are in `public/favicon.svg` and `index.html`.

## Interactions and rendering

Project filters and detail dialogs, keyboard-accessible mobile navigation, a process accordion, clipboard feedback, scroll reveals, smooth anchor scrolling, subtle scroll parallax, and spring-integrated pointer lighting and tilt are implemented.

The Three.js renderer is dynamically imported and capped at 30 fps and 1.5 device pixel ratio. It pauses when hidden or offscreen, renders a still for reduced-motion preferences, releases GPU resources on unmount, and uses a matching image fallback when WebGL is unavailable. Edit materials and geometry in `src/components/hero-system/createHeroSystem.js`. The existing `Hero3D.css` was preserved; the new scene layout is scoped in `portfolio.css`.

## Verification

Production build and lint were checked. Playwright browser checks covered project filtering, project dialogs, Escape dismissal and focus restoration, accordion state, contact brief copying, mobile navigation, reduced motion, and horizontal overflow at 320, 390, 768, 1024, and 1440 pixels. Local review screenshots are in the ignored `artifacts` directory.
