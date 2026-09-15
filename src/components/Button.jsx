import { useEffect, useRef } from 'react';
import { useMediaQuery, useMotionDisabled } from '../hooks/useMotion';
import './Button.css';

const variantClasses = {
  primary: 'button button-lime',
  secondary: 'button button-secondary',
  glass: 'button button-glass',
  outline: 'button button-outline',
  icon: 'icon-button',
  text: 'text-button',
};

export default function Button({ variant = 'primary', magnetic = false, className = '', href, children, ref: forwardedRef, ...props }) {
  const local = useRef(null);
  const disabledMotion = useMotionDisabled();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const element = local.current;
    if (!element || !magnetic || disabledMotion || !finePointer) return;
    let bounds, frame = 0, x = 0, y = 0;
    const enter = () => { bounds = element.getBoundingClientRect(); };
    const move = event => {
      if (!bounds) enter();
      x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 5;
      y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 4;
      if (!frame) frame = requestAnimationFrame(() => {
        element.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`);
        element.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`);
        frame = 0;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      element.style.setProperty('--magnetic-x', '0px');
      element.style.setProperty('--magnetic-y', '0px');
    };
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    element.addEventListener('blur', reset);
    return () => {
      reset();
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      element.removeEventListener('blur', reset);
    };
  }, [magnetic, disabledMotion, finePointer]);

  const Tag = href ? 'a' : 'button';
  return <Tag
    {...props}
    ref={element => {
      local.current = element;
      if (typeof forwardedRef === 'function') forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    }}
    href={href}
    type={href ? undefined : (props.type || 'button')}
    className={`ui-button ${variantClasses[variant]} ${className}`.trim()}
    data-variant={variant}
  >{children}</Tag>;
}
