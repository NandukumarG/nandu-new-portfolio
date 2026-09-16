# Earth imagery

The contact globe uses real equirectangular Earth maps by **Solar System Scope / INOVE**, based on NASA imagery and Blue Marble data. These maps are distributed by their creator under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), which permits reuse and adaptation with attribution.

Source and license statement: [Solar System Scope — Solar Textures](https://www.solarsystemscope.com/textures/) (verified September 16, 2026).

| Local asset | Original source |
| --- | --- |
| `public/textures/earth-daymap.jpg` | [2K Earth day map](https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg) |
| `public/textures/earth-nightmap.jpg` | [2K Earth night map](https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg) |
| `public/textures/earth-clouds.jpg` | [2K Earth clouds](https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg) |

The original JPEG files are stored locally without modification. Runtime rendering maps them onto a 3D sphere, adds directional shading and an atmosphere, and rotates the clouds separately. The imagery is illustrative, not live satellite or weather data. A visible credit and link to the source accompanies the globe.

The existing Three.js dependency provides the renderer. Earth loads only when the contact section approaches the viewport. Rotation completes once every 52 seconds, stops offscreen and in background tabs, and respects reduced motion and the site's motion toggle. A static globe with the same day texture is retained when WebGL is unsupported, lost, or textures fail to load.
