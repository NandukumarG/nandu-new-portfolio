import { ArrowUpRight, ArrowRight, MessageSquare, MapPin, Code2 } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import Button from './Button';
import { socialLinks } from '../data/portfolio';
import './Connect.css';
const EarthVisualization = lazy(() => import('./EarthVisualization'));
export default function Connect({ onContact, motionPaused }) {
  const host = useRef(null);
  const [loadEarth, setLoadEarth] = useState(false);
  useEffect(() => { const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoadEarth(true); observer.disconnect(); } }, { rootMargin: '250px' }); observer.observe(host.current); return () => observer.disconnect(); }, []);
  return <section id="connect" className="section contact-section">
    <div className="container"><Reveal className="eyebrow section-label"><span className="section-number">10 /</span> LET’S CONNECT</Reveal>
      <div className="contact-layout">
        <Reveal className="contact-copy"><h2>Let’s build<br />something{' '}<br /><em>useful.</em></h2><p>Have an idea, a project, or a problem that needs solving?</p><p>I’m always interested in building, experimenting, and learning something new.</p><Button magnetic onClick={onContact}>Let’s Talk <ArrowRight /></Button><span className="contact-location"><MapPin size={11} /> BASED IN INDIA. OPEN TO THE WORLD.</span></Reveal>
        <div className="earth-host" ref={host} role="group" aria-label="Slowly rotating Earth with blue oceans, satellite imagery, clouds, and orbital connections">
          <Suspense fallback={<div className="earth-fallback" />}>{loadEarth ? <EarthVisualization paused={motionPaused} /> : <div className="earth-fallback" />}</Suspense>
          <span className="earth-caption">Global ideas.<br /><em>Real solutions.</em></span>
        </div>
        <Reveal className="contact-panel glass"><div className="contact-panel-heading"><h3>Get in touch</h3><ArrowUpRight size={17} /></div>          {socialLinks.length > 0 && <div className="contact-links">{socialLinks.map(({ Icon, label, value, href }) => <a className="contact-link" href={href} key={label} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noreferrer' : undefined}><span className="contact-link-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{value}</small></span><ArrowUpRight size={13} /></a>)}</div>}
          <div className="contact-invitation"><span className="invitation-icon"><MessageSquare size={25} strokeWidth={1.2} /></span><h4>Have a project<br />in mind?</h4><p>I’d love to hear about it.</p><button className="contact-link" onClick={onContact}><span className="contact-link-icon"><Code2 size={17} /></span><span><strong>Start a conversation</strong><small>Tell me what you’re building</small></span><ArrowUpRight size={15} /></button></div>
        </Reveal>
      </div>
    </div>
  </section>;
}
