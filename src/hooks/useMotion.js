import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from 'react';

export const MotionContext = createContext(false);

export function useMediaQuery(query) {
  const subscribe = useCallback(listener => {
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

export function useMotionDisabled() {
  const paused = useContext(MotionContext);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return paused || reduced;
}

// Visibility changes update React only at the boundary, never on animation frames.
export function useElementActivity(ref, threshold = 0.05) {
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= threshold);
    }, { threshold: [0, threshold] });
    observer.observe(element);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [ref, threshold]);
  return visible && pageVisible;
}
