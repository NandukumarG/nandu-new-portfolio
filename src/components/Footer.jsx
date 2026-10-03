import { ArrowUp, Pause, Play } from 'lucide-react';
import { navLinks } from '../data/portfolio';
export default function Footer({ motionPaused, onToggleMotion }) {
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><div className="footer-brand"><a className="wordmark" href="#top" aria-label="Nanda Kumar home">NK<span>.</span></a><p><strong>Nanda Kumar</strong><br />Full Stack Developer<br />Building across code, cloud & digital experiences.</p></div><nav className="footer-nav" aria-label="Footer navigation">{navLinks.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav><div className="footer-end"><span>© {new Date().getFullYear()} Nanda Kumar</span><a className="back-top" href="#top">Back to top <ArrowUp size={14} /></a></div></div>
    <div className="footer-bottom"><span>Designed & built by Nanda Kumar.</span><button className="motion-toggle" onClick={onToggleMotion} aria-pressed={motionPaused}>{motionPaused ? <Play size={11} /> : <Pause size={11} />}{motionPaused ? 'Resume motion' : 'Pause motion'}</button></div>
  </div></footer>;
}