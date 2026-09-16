import { useEffect, useRef, useState } from 'react';
import { createHeroPlanetScene } from './HeroPlanetScene';
import './HeroOrbit.css';

export default function HeroPlanet3D({ paused = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pauseRef = useRef(paused);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    let frame = 0;
    let previousTime = 0;
    let isVisible = false;
    let isLoaded = false;
    let isDisposed = false;
    let scene = null;

    const render = () => {
      if (isLoaded && !isDisposed && scene) scene.render();
    };

    const animate = (now) => {
      frame = 0;
      if (isDisposed || !isVisible || !isLoaded || document.hidden || pauseRef.current || reducedMotion.matches) return;

      if (!previousTime || now - previousTime >= (mobile ? 40 : 16)) {
        if (previousTime && scene) {
          const delta = Math.min((now - previousTime) / 1000, 0.1);
          scene.advance(delta);
        }
        previousTime = now;
        render();
      }
      frame = requestAnimationFrame(animate);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (isVisible && isLoaded && !isDisposed && scene) {
        render();
        if (!document.hidden && !pauseRef.current && !reducedMotion.matches) {
          frame = requestAnimationFrame(animate);
        }
      }
    };

    try {
      scene = createHeroPlanetScene(canvas, {
        mobile,
        onReady: () => {
          if (isDisposed) return;
          isLoaded = true;
          setReady(true);
          sync();
        },
        onError: () => {
          if (isDisposed) return;
          setReady(false);
        },
      });
    } catch (e) {
      console.warn('Hero 3D planet fallback initialized:', e);
      return undefined;
    }

    if (!scene) return undefined;

    const handleResize = () => {
      if (!scene || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      scene.resize(w, h);
      render();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    handleResize();

    const onVisibilityChange = () => sync();
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', sync);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', sync);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-planet-3d-wrap" aria-hidden="true">
      {!ready && (
        <div className="hero-planet-fallback" />
      )}
      <canvas
        ref={canvasRef}
        className={`hero-planet-canvas${ready ? ' is-ready' : ''}`}
      />
    </div>
  );
}

