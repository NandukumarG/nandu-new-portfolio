# Hero system illustration

`Hero3D.jsx` is the reusable, noninteractive component. It dynamically loads
`createHeroSystem.js`; the existing hero layout and global tokens supply its
size and palette. Three.js owns only the transparent canvas inside that component.

- `SYSTEM` holds object positions, platform dimensions, flow timing, elbow radius,
  frame padding, and the seven-second, five-pixel float. The platform's top is
  world `y = 0`.
- `readPalette` reads the existing CSS custom properties, including their alpha
  values. Glass uses thick forest-tinted physical panes with partial transmission,
  separate token-based sheen, and pale edge reflections. Neutral tone mapping
  and soft lighting preserve warm ivory; path/signal colors bypass tone mapping
  to match the CSS accents. The desktop canvas extends 24 pixels to each side
  inside the hero's padding, without changing the hero layout's height.
- `roundedRoute` produces both the actual tube geometry and the arc-length path
  used by its signals. The five primary stages form an 18-second sequence;
  destination responses follow actual arrival times.
- The orthographic camera fits all modeled geometry on resize. The broad ground
  shadow is excluded from fitting. Floating translates the entire canvas so the
  cached shadows move with the platform and its objects.
- Intersection and document visibility jointly gate the animation loop. Reduced
  motion renders a completed still. Cleanup releases geometry, materials, textures,
  render targets, observers, listeners, and the renderer. Context loss reveals the
  fallback; restoration regenerates studio reflections before resuming.

`public/images/hero-system-preview.png` is a transparent capture of this actual
scene with reduced motion enabled. Regenerate it after changes to geometry or
tokens: capture `.hero-system` with ancestor backgrounds and its preview hidden,
using a transparent browser screenshot. The preview fits the canvas width and
stays vertically centered to match the camera's framing at each breakpoint.

Validation: production build and lint; browser checks at widths 320, 390, 768,
1024, and 1920; reduced-motion idle draw counts; animated/paused draw counts;
independent tab visibility and intersection conditions; WebGL loss/restoration;
and a browser with WebGL disabled. Existing carousel overflow is outside this
component's scope; the hero itself does not add horizontal overflow.
