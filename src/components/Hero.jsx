import { ArrowRight, ArrowDown } from 'lucide-react';
import { useRef } from 'react';
import HeroOrbit from './HeroOrbit';
import Button from './Button';
import { useHeroParallax } from '../hooks/useHeroParallax';
import { staticProjects, technologies } from '../data/portfolio';
import { fullStackProjects } from '../data/systems';
import './Hero.css';
export default function Hero() {
  const hero = useRef(null);
  useHeroParallax(hero);
  return <section ref={hero} id="top" className="cinema-hero">
    <div className="hero-atmosphere ambient" aria-hidden="true">
      <picture><source media="(max-width: 600px)" srcSet="/images/orbital-hero-mobile.webp" /><img src="/images/orbital-hero.webp" alt="" fetchPriority="high" width="1774" height="887" /></picture>
      <div className="hero-scrim" />
      <HeroOrbit />
      <div className="hero-stars">{[0,1,2,3,4].map(i => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="hero-foreground-atmosphere" />
    </div>
    <a className="vertical-scroll" href="#about"><span />BUILD · DEPLOY · SCALE<ArrowDown size={14} /></a>
    <div className="container hero-container">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> FULL STACK DEVELOPER</p>
        <h1>Complex<br />problems.<br /><em>Elegant software.</em><br />Real impact.</h1>
        <p className="hero-description">I’m Nandu. I build modern web applications,<br className="desktop-break" /> dependable backends, and cloud-ready systems.<br className="desktop-break" /> From the first idea to production.</p>
        <div className="hero-actions"><Button href="#work" magnetic>View My Work <ArrowRight /></Button><Button variant="secondary" href="#connect">Let’s Connect</Button></div>
        <div className="hero-stats">
          <div><strong>{String(staticProjects.length + fullStackProjects.length).padStart(2, '0')}<span> /</span></strong><span>Project concepts</span></div>
          <div><strong>{technologies.reduce((n, group) => n + group.items.length, 0)}<span> +</span></strong><span>Technologies</span></div>
          <div><strong>∞</strong><span>Possibilities</span></div>
        </div>
      </div>
      <div className="hero-capabilities glass" aria-label="Development capabilities">{['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps'].map(label => <span key={label}><i className="status-dot" />{label}</span>)}</div>
      <div className="hero-idea" aria-hidden="true">IDEAS<br />CODE<br />SOLVE<br />REPEAT<span /></div>
      <p className="hero-quote">“Turning ideas<br />into digital realities.”</p>
    </div>
    <div className="hero-bottom container"><span><i className="status-dot" />BASED IN INDIA · BUILDING EVERYWHERE</span><a href="#about">SCROLL TO EXPLORE <ArrowDown size={12} /></a><span>PEOPLE FIRST. CODE TO CLOUD.</span></div>
  </section>;
}
