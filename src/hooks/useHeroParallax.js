import { useEffect } from 'react';
import { useElementActivity, useMediaQuery, useMotionDisabled } from './useMotion';

export function useHeroParallax(ref) {
  const active = useElementActivity(ref);
  const disabled = useMotionDisabled();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty('--hero-x', '0px');
    element.style.setProperty('--hero-y', '0px');
    if (!active || disabled || !finePointer) return;

    let frame = 0;
    let bounds = element.getBoundingClientRect();
    const position = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const animate = () => {
      position.x += (position.targetX - position.x) * 0.085;
      position.y += (position.targetY - position.y) * 0.085;
      element.style.setProperty('--hero-x', `${position.x.toFixed(3)}px`);
      element.style.setProperty('--hero-y', `${position.y.toFixed(3)}px`);
      frame = Math.abs(position.targetX - position.x) + Math.abs(position.targetY - position.y) > 0.015
        ? requestAnimationFrame(animate) : 0;
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(animate); };
    const measure = () => { bounds = element.getBoundingClientRect(); };
    const move = event => {
      position.targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 8;
      position.targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 6;
      start();
    };
    const leave = () => { position.targetX = 0; position.targetY = 0; start(); };
    element.addEventListener('pointerenter', measure);
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointerenter', measure);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      element.style.setProperty('--hero-x', '0px');
      element.style.setProperty('--hero-y', '0px');
    };
  }, [ref, active, disabled, finePointer]);
}
