import { useEffect } from 'react';
export function useAmbientMotion(paused) {
  useEffect(() => {
    const elements = [...document.querySelectorAll('.ambient')];
    const visible = new Set();
    const sync = () => elements.forEach(el => el.classList.toggle('is-in-view', visible.has(el) && !document.hidden && !paused));
    const observer = new IntersectionObserver(entries => { entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)); sync(); }, { threshold: .01 });
    elements.forEach(el => observer.observe(el));
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [paused]);
}