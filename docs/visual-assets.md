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

## Rotating hero layers — September 16 update

Mode: built-in imagegen tool, edits of `public/images/orbital-hero.webp`.

The landscape and orbital system are separated so the entire planetary assembly can rotate while the developer, mountains, navigation, and copy stay still. This is a layered artwork animation, not a live 3D simulation of the hero planet. The contact Earth is a separate textured 3D sphere.

Saved landscape source: `public/images/hero-scene-v2.png`.
Production landscape: `public/images/hero-scene-v2.webp` and `public/images/hero-scene-mobile-v2.webp`.
Saved orbital source: `public/images/hero-orbital-system-v3.png`.
Production orbital plate: `public/images/hero-orbital-system-v3.webp`.
Conversion script: `scripts/optimize-hero-layers.cjs` (format/size conversion only).

Background edit prompt:

> Use case: precise-object-edit. Image 1 is the edit target: existing cinematic developer portfolio hero. Create a clean background plate for animation, same 2:1 framing and exact scene composition. Remove ONLY ALL planets/moons, the main huge Earth sphere, every orbital ring and their green light points/network lines in the sky. Fill where those objects were with the existing very dark deep teal-black starfield and extremely subtle nebula haze. PRESERVE the developer silhouette in the lower center at exactly the same size/position, all mountains and rocks, left upper overhanging cliff, foreground landscape, distant horizon and lighting. Preserve the dark negative space on the left. Do not add objects, typography, text, logos, or UI. The sky should be quiet and nearly black where the huge planet was. This will sit under a separate rotating planet assembly. Keep 2:1 canvas, edge-to-edge.

Orbital extraction prompt:

> Use case: background-extraction. Image 1 is the edit target. Create a high fidelity transparent PNG cutout of ONLY the complete main planetary orbital structure from the RIGHT side of this image: the huge detailed dark Earth-like sphere with luminous cyan-green rim, all the tilted fine lime orbital ellipses and delicate network lights around/across it, and all small moons near it including the large upper-right moon, left lower moon, foreground lower dark moon and small lower satellites. Keep the original arrangement, colors, lighting, dark photorealistic surface detail and tilted elliptical rings. EXCLUDE the far-left isolated moon near x=650. Remove ALL mountains, rocks, developer silhouette, cliff, horizon, background starfield and nebula: outside planets and fine rings must be genuine transparent alpha. Render just the isolated planet system centered on a wide transparent 3:2 canvas, the main sphere centered at approx 55% x, 53% y. Include all ring extents, leave a little transparent margin so no orbital ring is cropped. Preserve the reference appearance, do not invent new objects or restyle. No text or UI.

The extraction returned a painted transparency grid rather than alpha. The unused draft is retained only in ignored `artifacts/hero-orbital-system-draft.png`. A targeted built-in edit produced the final black plate, which is composited with screen blending:

> Use case: precise-object-edit. Input is edit target. Change ONLY the checkerboard background around the planet and orbital structure to perfectly pure solid black #000000. No checkerboard anywhere, no gray, no transparency grid. Preserve all planets, entire orbital ring system, fine green lines, glows, exact positions, scale, composition and the detailed surface of the big Earth-like sphere. Keep same wide 1536x1024 canvas. Replace EVERY checkerboard pixel with pure black, including gaps between orbit rings and all surrounding space. Do not add stars, mist, nebula, scenery, ground, text or UI. This is an isolated VFX plate composited with screen blending over a nearly black sky.
