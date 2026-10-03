import { ArrowRight, Code2, Layers, Orbit } from 'lucide-react';
import Reveal from './Reveal';
import './PracticeSection.css';

function PracticeArtwork({ id, steps }) {
  if (id === 'development') return <div className="practice-artwork practice-artwork-development" aria-hidden="true">
    <div className="art-code-window">
      <div className="art-window-bar"><span className="art-window-dots"><i /><i /><i /></span><span>src / app.jsx</span><Code2 size={14} /></div>
      <div className="art-code-lines"><span><i>01</i><b>function</b> buildApp() {'{'}</span><span><i>02</i>  <b>return</b> <em>&lt;Product /&gt;</em></span><span><i>03</i>{'}'}</span></div>
      <div className="art-window-status"><span /> BUILD READY <span>main</span></div>
    </div>
  </div>;

  if (id === 'devops') return <div className="practice-artwork practice-artwork-devops" aria-hidden="true">
    <div className="art-pipeline-head"><span>DELIVERY PIPELINE</span><span><i /> READY</span></div>
    <div className="art-pipeline-flow">{[['01', 'Source'], ['02', 'Build'], ['03', 'Test'], ['04', 'Deploy']].map(([number, label], index) => <div className="art-pipeline-step" key={number}>
      <span className="art-pipeline-node">{index === 0 ? <Code2 size={15} /> : index === 3 ? <Layers size={15} /> : <span>{number}</span>}</span>
      <strong>{label}</strong>
      {index < 3 && <ArrowRight className="art-pipeline-arrow" size={15} />}
    </div>)}</div>
    <div className="art-pipeline-tools"><span>GIT</span><span>DOCKER</span><span>CLOUD</span></div>
  </div>;

  if (id === 'ai') return <div className="practice-artwork practice-artwork-ai" aria-hidden="true">
    <span className="art-ai-node art-ai-input">IDEA</span>
    <span className="art-ai-node art-ai-output">CODE</span>
    <span className="art-ai-node art-ai-review">HUMAN REVIEW</span>
    <div className="art-ai-core"><Orbit size={27} /><span>AI ASSIST</span></div>
    <span className="art-ai-link art-ai-link-one" /><span className="art-ai-link art-ai-link-two" /><span className="art-ai-link art-ai-link-three" />
  </div>;

  if (id === 'design') return <div className="practice-artwork practice-artwork-design" aria-hidden="true">
    <div className="art-design-toolbar"><span className="art-design-active"><Layers size={15} /></span><span /><span /><span /><span /></div>
    <div className="art-design-canvas"><span className="art-design-label">FRAME / 01</span><div className="art-design-preview"><div className="art-design-photo"><span /></div><span className="art-design-line art-design-line-long" /><span className="art-design-line" /><span className="art-design-button" /></div><div className="art-design-palette"><i /><i /><i /><i /></div><Code2 className="art-design-cursor" size={17} /></div>
  </div>;

  return <div className="practice-artwork practice-artwork-approach" aria-hidden="true">
    <div className="art-approach-track">{steps.map(([title], index) => <div className="art-approach-step" key={title}>
      <span className="art-approach-number">0{index + 1}</span><strong>{title}</strong>
      {index < steps.length - 1 && <ArrowRight className="art-approach-arrow" size={14} />}
    </div>)}</div>
    <div className="art-approach-caption"><span /> A PRACTICE OF ITERATION</div>
  </div>;
}

export default function PracticeSection({ number, practice: { id, label, aside, heading, intro = [], steps = [], tags = [] } }) {
  return <section id={id} className={`section practice-section practice-${id}`}>
    <div className="container">
      <Reveal className="section-topline section-label"><p className="eyebrow"><span className="section-number">{String(number).padStart(2, '0')} /</span> {label}</p><span className="section-aside">{aside}</span></Reveal>
      <div className="practice-layout">
        <div className="practice-aside"><Reveal className="practice-heading"><h2>{heading[0]}<br /><em>{heading[1]}</em></h2></Reveal><PracticeArtwork id={id} steps={steps} /></div>
        <div className="practice-body">
          {intro.length > 0 && <Reveal className="practice-intro">{intro.map(p => <p key={p}>{p}</p>)}</Reveal>}
          {steps.length > 0 && <ol className="practice-steps">{steps.map(([title, copy], i) => <Reveal as="li" key={title} delay={i * 60} className="practice-step"><span className="practice-step-index">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}</ol>}
          {tags.length > 0 && <Reveal as="ul" className="practice-tags">{tags.map(t => <li key={t}>{t}</li>)}</Reveal>}
        </div>
      </div>
    </div>
  </section>;
}
