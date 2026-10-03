# Nanda Kumar — Full Stack Developer Portfolio

A responsive React 19 + Vite portfolio with a near-black and lime visual system. The existing application, local fonts, icons, project concepts, and reference assets are preserved.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Content and configuration

- `src/data/portfolio.js`: five existing frontend/interface concepts, five technology groups, capabilities, navigation, and optional contact links.
- `src/data/systems.js`: the existing FieldOps and Launchpad concepts and architecture notes.
- All seven entries remain explicitly labeled **concepts**. No live sites, personal profiles, shipped products, or extra projects have been invented to meet a target count.
- The two systems panels show proposed architecture, not verified deployed infrastructure.
- Copy `.env.example` to `.env.local` and fill in the real email, mobile number, GitHub, LinkedIn, and Reddit URLs. Unconfigured or invalid contact links stay hidden. Reference-image example details are not treated as real contact information.
- The contact dialog opens an email draft when an email is configured. Otherwise it copies a project brief and clearly states that nothing was sent. There is no contact backend.
- `src/components/` contains the existing section components, refactored carousel, shared project previews, lazy dialog, architecture panels, and contact globe. The earlier `Hero3D` and Three.js architecture implementation remain available, but the current page does not load them.

## Visuals and motion

The reference images in `src/reference/` define the composition. The hero uses a cleaned, generated version of the supplied artwork, with real HTML text and controls. No Three.js model is used in the hero.

Local WebP assets keep the hero landscape around 129 KB (50 KB mobile), its rotating orbital plate around 204 KB, and the workstation illustration around 19 KB. The small static moon uses the preserved original artwork. Original source assets are preserved. Asset provenance and generation prompts are in [docs/visual-assets.md](docs/visual-assets.md).

The carousel uses CSS perspective with a clear center card, solid faces and visible edges, tilted side cards, and two deeper background cards. It supports pointer drag, touch swipe, arrow buttons, direct slide selection, and Left/Right/Home/End keys. Desktop autoplay advances every 5.5 seconds; mobile uses 8 seconds. Hover, keyboard focus, held pointers, open dialogs, hidden tabs, and offscreen visibility pause it. A full reading interval (at least 6.5 seconds after interaction) precedes resuming. The local play/pause button is removed; the existing footer motion control can pause it indefinitely. Reduced motion disables autoplay and tilt while preserving manual controls. Inactive slides are inert and hidden from assistive technology; automatic changes do not trigger live announcements. Project and contact dialogs use native modal focus handling.

The hero artwork is separated into a stationary landscape and an orbital plate. The complete planet, moons, and rings rotate together around the main planet once every 120 seconds (160 on mobile). A foreground mask keeps the developer and rocks in front, and all typography stays stable. Existing motion hooks suspend this work offscreen, in hidden tabs, and for reduced motion. The Tech & Tools background has slow circuit pulses, a drifting grid, and soft atmospheric light. Shared buttons, project cards, and technology items use restrained glass highlights and reflections without adding a motion library.

The contact globe uses the existing Three.js dependency with real day/night Earth imagery, independently moving clouds, directional light, blue atmosphere, and depth-occluded orbital bands. It completes a rotation in approximately 52 seconds and preserves its angle when paused. The renderer is split into lazy chunks, caps pixel density/frame rate, pauses offscreen or when the tab is hidden, and respects reduced motion. It disposes GPU resources and retains a textured CSS fallback when WebGL is unavailable. Free texture sources and license details are in [docs/earth-assets.md](docs/earth-assets.md), with attribution beside the globe. Architecture diagrams now include original isometric vector illustrations and a sequential data pulse. CSS ambient motion pauses offscreen. A footer control pauses decorative motion.

## Verification

`npm run build` and `npm run lint` must pass.

A browser verification script is included in `scripts/verify-portfolio.cjs`. It requires Playwright (available in the current workspace), a Chromium installation, and a running production preview at port 4173. Set `PORTFOLIO_URL` to test another address.

```sh
node scripts/verify-portfolio.cjs
node scripts/verify-motion.cjs
```

Checks cover section order, deferred globe loading, filters, carousel controls and drag, project dialogs and focus restoration, contact brief copying, architecture interactions, animation pause/reduced motion, mobile navigation, internal links, missing images, runtime errors, and overflow at 320, 390, 768, 1024, and 1440 pixels. Screenshots are saved under the ignored `artifacts/` folder. These checks are browser validation, not a measured 60 FPS guarantee on every device.

The motion checks use Playwright’s controlled clock to verify whole-assembly hero rotation, desktop/mobile autoplay intervals, pause and delayed resume, focus and dialog suspension, global pause, offscreen behavior, reduced motion, touch hold/cancellation, and stationary hero typography during parallax.
