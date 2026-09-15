import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { capabilities } from '../data/portfolio';
import './Profile.css';
export default function Profile() {
  return <section id="about" className="section about-section">
    <div className="container">
      <Reveal className="eyebrow section-label"><span className="section-number">01 /</span> ABOUT ME</Reveal>
      <div className="about-grid">
        <Reveal className="about-copy"><h2>I turn ideas<br />into <em>real solutions.</em></h2><p>I’m Nandu, a full stack developer who connects real needs with useful products. I bring interfaces, APIs, databases, and dependable deployments together — with people at the center.</p><a className="text-button" href="#work">Get to know my work <ArrowUpRight size={15} /></a></Reveal>
        <div className="about-capabilities">{capabilities.map(({ Icon, title, copy }, i) => <Reveal key={title} delay={i * 70} className="capability-card"><span className="capability-icon glass"><Icon size={23} strokeWidth={1.3} /></span><h3>{title}</h3><p>{copy}</p></Reveal>)}</div>
      </div>
      <div className="about-bottom"><span>CURIOUS BY NATURE. AN ENGINEER BY PRACTICE.</span><span>Better software for a brighter tomorrow. <i>↗</i></span></div>
    </div>
    <svg className="about-wave" viewBox="0 0 1400 130" preserveAspectRatio="none" aria-hidden="true">{[0,1,2,3,4,5].map(i => <path key={i} d={`M0 ${120+i*3} C400 ${150-i*2} 620 ${-60+i*12} 950 ${90+i*7} S1280 85 1400 ${20+i*10}`} />)}</svg>
  </section>;
}