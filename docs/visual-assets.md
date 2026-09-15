# Visual assets

Mode: built-in image_gen tool, using the imagegen skill. No external image-generation API or new dependency was used.

## Hero

Reference/edit target: `src/reference/hero.png`. Also reviewed `src/reference/Full-UI.png` and `src/reference/aboutus.png`.

Saved source: `public/images/orbital-hero.png`.
Production assets: `public/images/orbital-hero.webp` and `public/images/orbital-hero-mobile.webp`.

Final prompt:

> Use case: precise-object-edit. Asset type: production website hero background, wide 2:1 landscape, high resolution. Input image is the exact composition reference and edit target. Remove ALL typography, logos, navigation, buttons, cards, UI panels, stats, quote text, labels, and the rounded outer frame from this image. Fill their areas naturally with the dark starfield and landscape. Preserve the cinematic scene and composition: immense dark Earth-like planet centered at about 73% width and 49% height, thin elegant neon lime orbital rings around it, a few small moons, dark rugged mountain foreground, lone anonymous developer silhouette viewed from behind standing on the rock around 49% width and 75% height. Keep the entire left 43% quiet very dark negative space for HTML typography. Planet should have realistic dark green continents, subtle network links, beautifully restrained lime rim lighting. Near-black green palette, photographic cinematic material detail, sophisticated minimal sci-fi atmosphere. Avoid excessive glow. NO TEXT ANYWHERE. No interface. No watermarks. Extend scene edge-to-edge without rounded corners. Match original composition closely.

## Developer workstation

Saved source: `public/images/developer-workstation.png`.
Production asset: `public/images/developer-workstation.webp`.

This is an anonymous illustration, not a portrait of the developer.

Final prompt:

> Use case: stylized-concept. Asset type: supporting illustration for the right side of a premium dark developer portfolio technology section. An anonymous developer seated at a workstation, seen from behind and slightly three-quarter rear, no visible face or identifying details, dark plain clothes. Two thin monitors display tiny understated code lines and a simple interface in muted green and white (no legible words necessary). Realistic cinematic illustration, dark silhouette, very subtle lime green rim light and monitor illumination, deep near-black green background #020604, restrained atmosphere, premium quiet material detail. Composition wide 4:3, person in center-right, desk along lower third, outer edges fade naturally to near-black. Person and workstation are secondary atmospheric elements, no floating icons, no clutter, no logos, no neon room, no text labels, no watermark.

## Preserved project images

Existing local architecture, lake, and forest images were converted to WebP for the Form Studio, Field Notes, CivicMaps, and Trail Index concept previews. These are illustrative compositions with live HTML typography, not screenshots of deployed products. Paper Weight uses a code-native editorial composition reflecting the existing print-first branding concept.

`scripts/optimize-assets.cjs` reproduces the loss-compressed WebP assets with browser canvas encoding. Original assets remain unchanged.

