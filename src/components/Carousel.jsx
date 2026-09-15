import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import ProjectPreview from './ProjectPreview';
import './Carousel.css';
export default function Carousel({ projects, onProject }) {
  const [active, setActive] = useState(0);
  const track = useRef(null);
  const drag = useRef(null);
  const dragged = useRef(false);
  const count = projects.length;
  const go = n => setActive((n + count) % count);
  const reset = () => { drag.current = null; track.current?.style.setProperty('--drag', '0px'); track.current?.style.setProperty('--tilt', '0deg'); };
  const endDrag = e => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { go(active + (dx < 0 ? 1 : -1)); dragged.current = true; }
    reset();
  };
  return <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Frontend project concepts">
    <div className="carousel-track" ref={track} tabIndex={0} aria-label="Use left and right arrow keys to browse projects"
      onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(active + (e.key === 'ArrowRight' ? 1 : -1)); } if (e.key === 'Home') { e.preventDefault(); go(0); } if (e.key === 'End') { e.preventDefault(); go(count - 1); } }}
      onPointerDown={e => { dragged.current = false; if (e.button !== 0 || e.target.closest('button,a')) return; drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => { if (drag.current) { const dx = e.clientX - drag.current.x; if (Math.abs(dx) > 6) dragged.current = true; e.currentTarget.style.setProperty('--drag', `${Math.max(-85, Math.min(85, dx * .45))}px`); } else if (e.pointerType === 'mouse' && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--tilt', `${((e.clientX-r.left)/r.width-.5)*3}deg`); } }}
      onPointerUp={endDrag} onPointerCancel={reset} onLostPointerCapture={reset} onPointerLeave={() => { if (!drag.current) track.current?.style.setProperty('--tilt', '0deg'); }}
      onClickCapture={e => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}>
      {projects.map((project, i) => {
        let offset = i - active;
        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;
        const center = offset === 0;
        const distance = Math.abs(offset);
        return <article key={project.id} className={`carousel-card glass${center ? ' is-active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${count}: ${project.name}`} aria-hidden={!center} inert={!center ? true : undefined}
          style={{ '--offset': offset, '--depth': `${-distance * 150}px`, '--rotation': `${offset * -17}deg`, '--scale': 1 - Math.min(distance, 2) * .1, opacity: distance > 1 ? 0 : 1 - distance * .46, zIndex: 10 - distance, visibility: distance > 1 ? 'hidden' : 'visible' }}>
          <ProjectPreview project={project} />
          <div className="carousel-card-body"><div className="project-meta"><span>{project.category}</span><span>CONCEPT / 0{i+1}</span></div><div className="project-title-row"><h3>{project.name}</h3><button className="icon-button" onClick={() => onProject(project)} aria-label={`Explore ${project.name} concept`}><ArrowUpRight size={18} /></button></div><p>{project.description}</p><div className="project-card-bottom"><div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div><button className="text-button" onClick={() => onProject(project)}>View concept <ArrowUpRight size={13} /></button></div></div>
        </article>;
      })}
    </div>
    <div className="carousel-controls">
      <button className="icon-button" aria-label="Previous project" onClick={() => go(active - 1)} disabled={count < 2}><ArrowLeft size={17} /></button>
      <div className="carousel-dots" aria-label="Choose a project">{projects.map((p,i) => <button key={p.id} className={i === active ? 'active' : ''} aria-label={`Show ${p.name}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(i)}><span /></button>)}</div>
      <span className="carousel-index" aria-live="polite" aria-atomic="true">{String(active+1).padStart(2,'0')} <span>/ {String(count).padStart(2,'0')}</span><span className="sr-only"> — {projects[active].name}</span></span>
      <button className="icon-button" aria-label="Next project" onClick={() => go(active + 1)} disabled={count < 2}><ArrowRight size={17} /></button>
    </div>
  </div>;
}
