import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { navLinks } from '../data/portfolio';
import Button from './Button';
import './Nav.css';
export default function Nav({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');
  const [open, setOpen] = useState(false);
  const mobile = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setActive(e.target.id === 'systems' ? 'work' : e.target.id);
    }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => { window.removeEventListener('scroll', scroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const el = mobile.current;
    const trigger = toggle.current;
    el.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = matchMedia('(min-width: 761px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', resize);
    return () => { el.close(); document.body.style.overflow = previousOverflow; trigger?.focus(); desktop.removeEventListener('change', resize); };
  }, [open]);
  return <>
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <a className="wordmark" href="#top" aria-label="Nandu home">NK<span>.</span></a>
      <span className="nav-tagline">Build. Deploy. Scale.</span>
      <nav className="main-nav" aria-label="Primary navigation">
        {navLinks.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
      </nav>
      <Button variant="outline" className="header-cta" onClick={onContact}>Let’s Talk <ArrowRight /></Button>
      <Button variant="icon" ref={toggle} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={19} /></Button>
    </header>
    <dialog ref={mobile} id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" onCancel={() => setOpen(false)}>
      <div className="mobile-nav-top"><span className="wordmark">NK<span>.</span></span><Button variant="icon" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={20} /></Button></div>
      <nav>{navLinks.map(([id, label], i) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowRight size={22} /></a>)}</nav>
      <p>FROM IDEAS TO WORKING SYSTEMS.</p>
    </dialog>
  </>;
}
