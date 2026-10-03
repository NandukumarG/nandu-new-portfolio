import { ArrowRight, ArrowDown } from 'lucide-react';
import { useRef } from 'react';
import HeroOrbit from './HeroOrbit';
import Button from './Button';
import { useHeroParallax } from '../hooks/useHeroParallax';
import { staticProjects, technologies } from '../data/portfolio';
import { fullStackProjects } from '../data/systems';
import './Hero.css';

export default function Hero({ motionPaused = false }) {
  const hero = useRef(null);
  useHeroParallax(hero);

  const categories = ['Frontend', 'Backend', 'Cloud', 'DevOps', 'AI'];

  return (
    <section ref={hero} id="top" className="cinema-hero">
      <div className="hero-atmosphere ambient" aria-hidden="true">
        <picture>
          <source media="(max-width: 600px)" srcSet="/images/hero-scene-mobile-v2.webp" />
          <img src="/images/hero-scene-v2.webp" alt="" fetchPriority="high" width="1774" height="887" />
        </picture>
        <HeroOrbit paused={motionPaused} />
        <div className="hero-scrim" />
        <div className="hero-nebula-glow" />
        <div className="hero-stars">{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} style={{ '--i': i }} />)}</div>
        <div className="hero-foreground-atmosphere" />
      </div>

      <a className="vertical-scroll" href="#about">
        <span />BUILD · DEPLOY · SCALE<ArrowDown size={14} />
      </a>

      <div className="container hero-container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> FULL STACK DEVELOPER · DEVOPS
          </p>
          <h1>
            I build digital experiences<br />
            that work beyond<br />
            <em>the screen.</em>
          </h1>
          <p className="hero-description">
            I’m Nanda, a Full Stack Developer who enjoys building modern web applications and turning ideas into reliable, production-ready experiences. From creating interfaces and connecting APIs to deploying applications and automating workflows, I enjoy working across the complete development journey.
          </p>
          <div className="hero-actions">
            <Button href="#work" magnetic>View My Work <ArrowRight /></Button>
            <Button variant="secondary" href="#connect">Let’s Connect <ArrowRight /></Button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{String(staticProjects.length + fullStackProjects.length).padStart(2, '0')}<span> /</span></strong>
              <span>Project concepts</span>
            </div>
            <div>
              <strong>{technologies.reduce((n, group) => n + group.items.length, 0)}<span> +</span></strong>
              <span>Technologies</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Possibilities</span>
            </div>
          </div>
        </div>

        {/* Sleek glassmorphism card listing tech stack categories */}
        <div className="hero-capabilities glass" aria-label="Development capabilities">
          <div className="capabilities-header">
            <span className="capabilities-badge">STACK</span>
            <span className="capabilities-dot" />
          </div>
          <div className="capabilities-items">
            {categories.map((label) => (
              <span key={label} className="capability-pill">
                <i className="status-dot" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle typography displaying code-themed mottos */}
        <div className="hero-idea" aria-hidden="true">
          <div className="hero-idea-motto">
            <span>IDEAS.</span>
            <span>CODE.</span>
            <span>SOLVE.</span>
            <span>REPEAT.</span>
          </div>
          <span className="hero-idea-line" />
        </div>

        <p className="hero-quote">
          “Turning ideas<br />into digital realities.”
        </p>
      </div>

      <div className="hero-bottom container">
        <span><i className="status-dot" />BASED IN INDIA · BUILDING EVERYWHERE</span>
        <a href="#about">SCROLL TO EXPLORE <ArrowDown size={12} /></a>
        <span>PEOPLE FIRST. CODE TO CLOUD.</span>
      </div>
    </section>
  );
}
