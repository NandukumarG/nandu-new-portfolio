import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useElementActivity, useMediaQuery, useMotionDisabled } from '../hooks/useMotion';
import Button from './Button';
import ProjectPreview from './ProjectPreview';
import './Carousel.css';
export default function Carousel({ projects, onProject, suspended = false }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const host = useRef(null);
  const track = useRef(null);
  const drag = useRef(null);
  const dragged = useRef(false);
  const frame = useRef(0);
  const bounds = useRef(null);
  const visible = useElementActivity(host, .35);
  const motionDisabled = useMotionDisabled();
  const mobile = useMediaQuery('(max-width: 700px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const count = projects.length;
  const rotating = count > 1 && visible && !motionDisabled && !suspended && !hovered && !focused && !touching;

  // Restart a full reading interval after every interaction or visibility change.
  // Focus stays paused until it leaves the carousel, including while reading links.
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActive(current => (current + 1) % count), mobile ? 8000 : interaction ? 6500 : 5500);
    return () => window.clearTimeout(timer);
  }, [rotating, active, count, mobile, interaction]);

  useEffect(() => {
    if (!touching) return;
    const release = () => { setTouching(false); setInteraction(current => current + 1); };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [touching]);

  useEffect(() => {
    const element = track.current;
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      element?.style.setProperty('--tilt-x', '0deg');
      element?.style.setProperty('--tilt-y', '0deg');
    };
  }, [motionDisabled, active]);

  const interacted = () => setInteraction(current => current + 1);
  const go = n => { if (!count) return; setActive((n + count) % count); interacted(); };
  const resetTilt = () => {
    cancelAnimationFrame(frame.current); frame.current = 0;
    track.current?.style.setProperty('--tilt-x', '0deg');
    track.current?.style.setProperty('--tilt-y', '0deg');
  };
  const reset = () => {
    drag.current = null;
    setTouching(false);
    track.current?.classList.remove('is-dragging');
    track.current?.style.setProperty('--drag', '0px');
    resetTilt();
  };
  const endDrag = e => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { go(active + (dx < 0 ? 1 : -1)); dragged.current = true; }
    reset();
  };
  if (!count) return <p className="container work-intro">New work in this area is on the way.</p>;

  return <div ref={host} className="carousel" role="region" aria-roledescription="carousel" aria-label="Project concepts"
    onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onPointerDownCapture={() => { setTouching(true); interacted(); }}
    onPointerUpCapture={() => { setTouching(false); interacted(); }}
    onPointerCancelCapture={() => { setTouching(false); interacted(); }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setFocused(false); interacted(); } }}>
    <div className="carousel-track" ref={track} tabIndex={0} aria-label="Use left and right arrow keys to browse projects"
      onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(active + (e.key === 'ArrowRight' ? 1 : -1)); } if (e.key === 'Home') { e.preventDefault(); go(0); } if (e.key === 'End') { e.preventDefault(); go(count - 1); } }}
      onPointerDown={e => {
        dragged.current = false;
        if (!e.isPrimary || e.button !== 0 || e.target.closest('button,a')) return;
        resetTilt();
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.classList.add('is-dragging');
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerEnter={() => { bounds.current = track.current.querySelector('.is-active')?.getBoundingClientRect(); }}
      onPointerMove={e => {
        if (drag.current) {
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 6) dragged.current = true;
          e.currentTarget.style.setProperty('--drag', `${Math.max(-100, Math.min(100, dx * .55))}px`);
        } else if (e.pointerType === 'mouse' && finePointer && !motionDisabled && !mobile && e.target.closest('.carousel-card.is-active') && !e.target.closest('button,a')) {
          if (frame.current) return;
          const { clientX, clientY } = e;
          frame.current = requestAnimationFrame(() => {
            const r = bounds.current;
            if (r) {
              const x = Math.max(-1, Math.min(1, (clientX - r.left) / r.width * 2 - 1));
              const y = Math.max(-1, Math.min(1, (clientY - r.top) / r.height * 2 - 1));
              track.current.style.setProperty('--tilt-y', `${x * 3.5}deg`);
              track.current.style.setProperty('--tilt-x', `${y * -2.5}deg`);
            }
            frame.current = 0;
          });
        }
      }}
      onPointerUp={endDrag} onPointerCancel={reset} onLostPointerCapture={reset} onPointerLeave={() => { if (!drag.current) resetTilt(); }}
      onClickCapture={e => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}>
      {projects.map((project, i) => {
        let offset = i - active;
        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;
        const center = offset === 0;
        const distance = Math.abs(offset);
        return <article key={project.id} className={`carousel-card${center ? ' is-active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${count}: ${project.name}`} aria-hidden={!center} inert={!center ? true : undefined}
          style={{ '--offset': offset, '--depth': `${-distance * 205}px`, '--rotation': `${offset * -27}deg`, '--scale': 1 - Math.min(distance, 2) * .045, '--card-brightness': center ? 1 : distance === 1 ? .76 : .4, '--card-lift': `${distance * 10}px`, zIndex: 10 - distance, visibility: distance > 2 ? 'hidden' : 'visible' }}>
          <span className="carousel-card-edge edge-left" aria-hidden="true" />
          <span className="carousel-card-edge edge-right" aria-hidden="true" />
          <div className="carousel-card-face">
          <ProjectPreview project={project} />
          <div className="carousel-card-body"><div className="project-meta"><span>{project.category}</span><span>CONCEPT / 0{i+1}</span></div><div className="project-title-row"><h3>{project.name}</h3><Button variant="icon" onClick={() => onProject(project)} aria-label={`Explore ${project.name} concept`}><ArrowUpRight size={18} /></Button></div><p>{project.description}</p><div className="project-card-bottom"><div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div><Button variant="text" onClick={() => onProject(project)}>View concept <ArrowUpRight size={13} /></Button></div></div>
          </div>
        </article>;
      })}
    </div>
    <div className="carousel-controls">
      <Button variant="icon" aria-label="Previous project" onClick={() => go(active - 1)} disabled={count < 2}><ArrowLeft size={17} /></Button>
      <div className="carousel-dots" aria-label="Choose a project">{projects.map((p,i) => <button key={p.id} className={i === active ? 'active' : ''} aria-label={`Show ${p.name}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(i)}><span /></button>)}</div>
      <span className="carousel-index" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">{String(active+1).padStart(2,'0')} <span>/ {String(count).padStart(2,'0')}</span><span className="sr-only"> — {projects[active].name}</span></span>
      <Button variant="icon" aria-label="Next project" onClick={() => go(active + 1)} disabled={count < 2}><ArrowRight size={17} /></Button>
    </div>
  </div>;
}
