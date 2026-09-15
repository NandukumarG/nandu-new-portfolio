import { useEffect, useId, useRef } from 'react';
import { useElementActivity, useMediaQuery, useMotionDisabled } from '../hooks/useMotion';
import './HeroOrbit.css';

// Artwork coordinates: preserve the original image and align a few live paths
// to its planet. Different speeds supply depth without rotating the bitmap.
const CENTER = [1260, 424];
const ORBITS = [
  { rx: 456, ry: 130, tilt: -19, seconds: 58, phase: 0.38, radius: 9 },
  { rx: 373, ry: 234, tilt: -31, seconds: 44, phase: 2.75, radius: 6 },
  { rx: 510, ry: 84, tilt: -12, seconds: 32, phase: 5.1, radius: 2 },
];

export default function HeroOrbit() {
  const host = useRef(null);
  const svg = useRef(null);
  const elapsed = useRef(0);
  const active = useElementActivity(host);
  const disabled = useMotionDisabled();
  const mobile = useMediaQuery('(max-width: 760px)');
  const gradientId = useId();

  useEffect(() => {
    const element = host.current;
    const measure = () => {
      const width = element.clientWidth, height = element.clientHeight;
      const scale = Math.max(width / 1774, height / 887);
      const viewWidth = width / scale, viewHeight = height / scale;
      const x = (1774 - viewWidth) * (mobile ? 0.68 : 0.55);
      const y = (887 - viewHeight) * (mobile ? 1 : 0.5);
      svg.current.setAttribute('viewBox', `${x} ${y} ${viewWidth} ${viewHeight}`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element); measure();
    return () => observer.disconnect();
  }, [mobile]);

  useEffect(() => {
    const groups = [...svg.current.querySelectorAll('[data-orbit]')].map(group => ({
      group,
      path: group.querySelector('.hero-orbit-trail'),
      satellite: group.querySelector('.hero-orbit-satellite'),
      particle: group.querySelector('.hero-orbit-particle'),
    }));
    let frame = 0, previous = 0;
    const paint = () => groups.forEach(({ group, path, satellite, particle }, index) => {
      const orbit = ORBITS[index];
      const cycle = elapsed.current / (orbit.seconds * 1000 * (mobile ? 1.5 : 1));
      const angle = cycle * Math.PI * 2 + orbit.phase;
      const precession = Math.sin(elapsed.current / 32000 + index) * 3;
      group.setAttribute('transform', `translate(${CENTER.join(' ')}) rotate(${orbit.tilt + precession})`);
      path.style.strokeDashoffset = String(-cycle * 1000);
      [satellite, particle].forEach((node, i) => {
        const t = angle + i * 1.3;
        const x = Math.cos(t) * orbit.rx, y = Math.sin(t) * orbit.ry;
        const behindPlanet = y < 0 && Math.hypot(x, y) < 240;
        node.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(.85 + Math.sin(t) * .18).toFixed(3)})`);
        node.style.opacity = behindPlanet ? '0' : (i ? '.7' : '.9');
      });
    });
    const tick = now => {
      if (!previous || now - previous >= (mobile ? 65 : 32)) {
        if (previous) elapsed.current += Math.min(now - previous, 100);
        previous = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    paint();
    if (active && !disabled) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, disabled, mobile]);

  return <div ref={host} className="hero-orbit-window" aria-hidden="true">
    <svg ref={svg} className="hero-orbit-svg" viewBox="0 0 1774 887" preserveAspectRatio="none">
      <defs>
        <radialGradient id={gradientId} cx="27%" cy="25%" r="75%">
          <stop offset="0" stopColor="#d5eeb0" /><stop offset=".25" stopColor="#466d3b" />
          <stop offset=".7" stopColor="#10251b" /><stop offset="1" stopColor="#030b08" />
        </radialGradient>
      </defs>
      {ORBITS.map((orbit, index) => <g key={orbit.seconds} data-orbit={index} className={`hero-live-orbit hero-live-orbit-${index}`}>
        <ellipse className="hero-orbit-path" rx={orbit.rx} ry={orbit.ry} />
        <ellipse className="hero-orbit-trail" rx={orbit.rx} ry={orbit.ry} pathLength="1000" />
        <g className="hero-orbit-satellite"><circle r={orbit.radius} fill={index === 2 ? '#daff9c' : `url(#${gradientId})`} stroke="#c3e99c" strokeOpacity=".38" strokeWidth=".65" /></g>
        <g className="hero-orbit-particle"><circle r="1.7" fill="#d9ffae" /><circle r="4.5" fill="#b6ff00" opacity=".07" /></g>
      </g>)}
    </svg>
  </div>;
}
