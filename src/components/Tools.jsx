import { Code2, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { technologies } from '../data/portfolio';
import './Tools.css';
export default function Tools() {
  return <section id="stack" className="section stack-section">
    <div className="container">
      <Reveal className="section-topline section-label"><p className="eyebrow"><span className="section-number">02 /</span> TECH STACK</p><span className="section-aside">MODERN TOOLS. REAL POSSIBILITIES.</span></Reveal>
      <Reveal><h2>Technologies<br /><em>I work with.</em></h2></Reveal>
      <div className="stack-layout">
        <div className="tech-groups">{technologies.map(({ title, items }, i) => <Reveal className={`tech-category tech-category-${i}`} delay={i * 50} key={title}><h3><span>0{i + 1}</span>{title}</h3><ul>{items.map(([Icon, label]) => <li className="tech-item glass" key={label}><span aria-hidden="true"><Icon /></span>{label}</li>)}</ul></Reveal>)}</div>
        <Reveal className="developer-profile"><img src="/images/developer-workstation.webp" width="900" height="675" alt="Illustration of an anonymous developer viewed from behind, working at softly lit monitors" loading="lazy" /><div className="developer-caption"><span className="developer-label glass"><Code2 size={13} /> FROM CODE TO CLOUD</span><p>One connected workflow.<br /><span>Every layer, considered.</span></p></div></Reveal>
      </div>
      <div className="stack-footnote"><span>THE RIGHT TOOL FOR THE RIGHT PROBLEM.</span><a href="#systems">See the systems behind the work <ArrowUpRight size={13} /></a></div>
    </div>
  </section>;
}