import { useEffect, useRef, useState } from 'react';
import { createEarthScene } from './earthScene';

export default function EarthVisualization({ paused }) {
  const canvasRef = useRef(null);
  const pauseRef = useRef(paused);
  const syncRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pauseRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(pointer: coarse)').matches;
    let frame = 0, previous = 0, visible = false, loaded = false, disposed = false;
    let scene;

    const render = () => {
      if (loaded && !disposed) scene?.render();
    };
    const animate = now => {
      frame = 0;
      if (disposed || !visible || !loaded || document.hidden || pauseRef.current || reduced.matches) return;
      if (!previous || now - previous >= (mobile ? 50 : 32)) {
        if (previous) scene.advance(Math.min(now - previous, 100) / 1000);
        previous = now;
        render();
      }
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && loaded && !disposed) {
        render();
        if (!document.hidden && !pauseRef.current && !reduced.matches) frame = requestAnimationFrame(animate);
      }
    };
    const contextLost = event => {
      event.preventDefault();
      loaded = false;
      cancelAnimationFrame(frame);
      setReady(false);
    };
    const contextRestored = () => {
      if (disposed || !scene) return;
      loaded = true;
      setReady(true);
      sync();
    };

    try {
      scene = createEarthScene(canvas, {
        mobile,
        onReady: () => {
          if (disposed) return;
          loaded = true;
          setReady(true);
          sync();
        },
        onError: () => {
          if (disposed) return;
          loaded = false;
          cancelAnimationFrame(frame);
          setReady(false);
        },
      });
    } catch {
      // The textured CSS globe remains visible when WebGL is unavailable.
      return undefined;
    }
    if (!scene) return undefined;

    const resize = () => {
      scene.resize(Math.max(1, canvas.clientWidth), Math.max(1, canvas.clientHeight));
      render();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);
    syncRef.current = sync;
    resize();

    return () => {
      disposed = true;
      syncRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      scene.dispose();
    };
  }, []);

  return <>
    {!ready && <div className="earth-fallback earth-fallback-textured" aria-hidden="true" />}
    <canvas ref={canvasRef} className="earth-canvas" data-earth-ready={ready} aria-hidden="true" />
    <a className="earth-credit" href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer" aria-label="Earth textures by Solar System Scope, licensed under Creative Commons Attribution 4.0">Earth imagery · Solar System Scope</a>
  </>;
}
