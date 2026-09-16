import { Code2, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { technologies } from '../data/portfolio';
import './Tools.css';
export default function Tools() {
  return <section id="stack" className="section stack-section">
    <div className="stack-motion ambient" aria-hidden="true">
      <div className="stack-motion-haze" /><div className="stack-motion-grid" />
      <svg className="stack-circuits" viewBox="0 0 1440 780" preserveAspectRatio="xMidYMid slice">
        <defs><linearGradient id="stack-circuit-fade"><stop stopColor="#86bbaa" stopOpacity="0" /><stop offset=".48" stopColor="#86bbaa" stopOpacity=".4" /><stop offset="1" stopColor="#b6ff00" stopOpacity=".04" /></linearGradient></defs>
        {['M-80 630H310L430 510H870L1030 350H1510', 'M-40 710H450L565 595H920L1090 425H1490', 'M240 840V742L370 612V490L455 405H710L850 265H1450'].map((path, index) => <g key={path} style={{ '--circuit-delay': `${index * -7}s` }}>
          <path className="stack-circuit-path" d={path} />
          <path className="stack-circuit-pulse" pathLength="1000" d={path} />
        </g>)}
        {[[430,510],[870,510],[1030,350],[565,595],[920,595],[1090,425],[455,405],[850,265]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" className="stack-circuit-node" />)}
      </svg>
    </div>
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
