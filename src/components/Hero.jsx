import { ArrowDownRight, ArrowUpRight, ChevronDown, Move } from 'lucide-react'
import Hero3D from './Hero3D'
import Reveal from './Reveal'
import './Hero.css'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <span className="hero-corner-mark" aria-hidden="true">
        <span className="hero-corner-line" />
        <span className="hero-corner-dot" />
      </span>

      <div className="hero-inner">
        <Reveal className="hero-copy">
          <p className="eyebrow">Forward Deployed Engineer</p>
          <h1 className="hero-title">
            Complex problems.
            <em>Elegant software.</em>
            Real impact.
          </h1>
          <p className="hero-sub">
            I work with people, build across the stack, and bring solutions into
            production.
          </p>
          <div className="hero-actions">
            <a className="btn btn-lime" href="#work">
              Explore my work <ArrowDownRight size={16} aria-hidden="true" />
            </a>
            <a className="btn btn-ghost" href="#profile">
              Meet the engineer <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal as="div" className="hero-graphic" delay={150}>
          <Hero3D />
        </Reveal>
      </div>

      <Reveal as="div" className="hero-meta" delay={250}>
        <span className="hero-meta-item">People first. Code to cloud.</span>
        <a className="hero-scroll" href="#profile" aria-label="Scroll to profile">
          <ChevronDown size={16} />
        </a>
        <span className="hero-pill">
          Drag to explore <Move size={13} aria-hidden="true" />
        </span>
        <span className="hero-stages">
          <span>Build</span>
          <span>Connect</span>
          <span className="is-active">Deploy</span>
        </span>
        <span className="hero-meta-item hero-tagline">
          Systems for a brighter tomorrow.
        </span>
      </Reveal>
    </section>
  )
}
