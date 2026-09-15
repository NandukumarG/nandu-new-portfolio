import { useEffect, useRef } from 'react';
export default function Cursor({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const query = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0, x = 0, y = 0;
    const move = e => {
      if (paused || !query.matches) return;
      x = e.clientX; y = e.clientY;
      const hovering = !!e.target.closest('a, button, .carousel-card');
      el.classList.toggle('is-hovering', hovering);
      if (!frame) frame = requestAnimationFrame(() => { const half = hovering ? 21 : 14; el.style.transform = `translate3d(${x - half}px,${y - half}px,0)`; el.style.opacity = '1'; frame = 0; });
    };
    const hide = () => { el.style.opacity = '0'; };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    if (paused) hide();
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); };
  }, [paused]);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}