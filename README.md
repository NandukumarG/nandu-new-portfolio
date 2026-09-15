# Nandu — Full Stack Developer Portfolio

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

Local WebP assets keep the hero around 160 KB (60 KB mobile) and workstation illustration around 19 KB. Original source assets are preserved. Asset provenance and full generation prompts are in [docs/visual-assets.md](docs/visual-assets.md).

The carousel uses CSS perspective with pointer drag, touch swipe, arrow buttons, direct slide selection, and Left/Right/Home/End keys. Inactive slides are inert and hidden from assistive technology. Project and contact dialogs use native modal focus handling.

The globe uses a small, lazily imported Canvas 2D renderer with a projected sphere, simplified decorative coastlines, network nodes, and three orbital bands. It caps pixel density and frame rate, pauses offscreen or when the tab is hidden, and respects reduced motion. It allocates no WebGL context. CSS ambient motion also pauses offscreen. A footer control pauses decorative motion.

## Verification

`npm run build` and `npm run lint` must pass.

A browser verification script is included in `scripts/verify-portfolio.cjs`. It requires Playwright (available in the current workspace), a Chromium installation, and a running production preview at port 4173. Set `PORTFOLIO_URL` to test another address.

```sh
node scripts/verify-portfolio.cjs
```

Checks cover section order, deferred globe loading, filters, carousel controls and drag, project dialogs and focus restoration, contact brief copying, architecture interactions, animation pause/reduced motion, mobile navigation, internal links, missing images, runtime errors, and overflow at 320, 390, 768, 1024, and 1440 pixels. Screenshots are saved under the ignored `artifacts/` folder. These checks are browser validation, not a measured 60 FPS guarantee on every device.
