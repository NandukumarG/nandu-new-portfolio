import { ArrowUpRight, Check } from 'lucide-react';
import { useId, useState } from 'react';
import Reveal from './Reveal';
import Button from './Button';
import { fullStackProjects } from '../data/systems';
import './FullStackSection.css';

const architectures = [
  {
    label: 'APPLICATION ARCHITECTURE', detail: 'INTERFACE → INFRASTRUCTURE', center: ['Connected', 'by design'],
    features: ['Role-based access', 'Optimistic updates', 'Auditable activity'],
    stages: [
      ['frontend', 'Frontend', 'React', 'A focused interface for everyday operations.'],
      ['server', 'API & Backend', 'FastAPI', 'Services connect the interface to shared workflows.'],
      ['database', 'Database', 'PostgreSQL', 'A structured data model with an auditable activity stream.'],
      ['cloud', 'Deployment', 'Docker / AWS', 'Containerized delivery, as outlined in the original concept.'],
    ],
  },
  {
    label: 'DELIVERY ARCHITECTURE', detail: 'SOURCE → PRODUCTION', center: ['Built to ship', 'with confidence'],
    features: ['Immutable containers', 'Health checks', 'Rollback path'],
    stages: [
      ['source', 'Source', 'GitHub Actions', 'A source change starts the proposed delivery pipeline.'],
      ['build', 'Build', 'Docker', 'Build an immutable container artifact.'],
      ['validate', 'Validate', 'Staging / checks', 'Run checks before promoting the same artifact.'],
      ['cloud', 'Deploy', 'AWS', 'Release to production with health checks and a rollback path.'],
    ],
  },
];

// Small vector objects keep the architecture crisp at every screen size.
function StageArtwork({ type }) {
  const id = useId();
  const face = `url(#${id}-face)`;
  const top = `url(#${id}-top)`;
  return <svg className="stage-artwork" viewBox="0 0 110 88" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-face`} x1="20" y1="10" x2="90" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#244438" /><stop offset="1" stopColor="#071911" /></linearGradient>
      <linearGradient id={`${id}-top`} x1="35" y1="10" x2="80" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="var(--system-light)" stopOpacity=".48" /><stop offset="1" stopColor="#16332a" /></linearGradient>
    </defs>
    <path className="object-platform-bottom" d="m12 67 44-13 43 13v6L56 86 12 73Z" />
    <path className="object-platform-top" d="m12 67 44-13 43 13-43 13Z" />
    {type === 'frontend' && <g>
      <path d="m45 57 12-3v12l13 4-21 6-13-4 9-3Z" fill={face} stroke="#65957d" strokeWidth=".6" />
      <path d="m20 19 65-12 5 4v44L25 68l-5-4Z" fill="#08120e" stroke="#6e9f86" strokeWidth=".7" />
      <path d="m25 23 65-12v44L25 68Z" fill={face} stroke="#a3ceb4" strokeWidth=".7" />
      <path d="m30 27 54-10v32L30 60Z" fill="#081e18" />
      <path d="m30 33 54-10" stroke="#62947b" strokeWidth=".6" />
      <path d="m34 39 13-2v15l-13 3Z" fill="var(--system-light)" opacity=".21" />
      <path d="m52 37 25-5m-25 11 19-4m-19 10 25-5" stroke="var(--system-light)" strokeWidth="1.6" opacity=".65" />
      <circle cx="34" cy="28" r="1" fill="var(--system-light)" />
    </g>}
    {type === 'server' && <g>
      <path d="m30 18 33-10 21 13v45L51 77 30 64Z" fill={face} stroke="#74a88a" strokeWidth=".7" />
      <path d="m30 18 33-10 21 13-33 11Z" fill={top} stroke="#99c79b" strokeWidth=".7" />
      <path d="M51 32v45l33-11V21Z" fill="#0d251b" />
      {[0, 1, 2].map(row => <g key={row} transform={`translate(0 ${row * 13})`}>
        <path d="m34 25 13 8v9l-13-8Z" fill="#0a1914" stroke="#436b55" strokeWidth=".5" />
        <path d="m56 34 22-7v8l-22 7Z" fill="#06120c" stroke="#40674c" strokeWidth=".5" />
        <path d="m60 35 11-3" stroke="#759175" strokeWidth=".8" />
        <circle className="object-light" cx="75" cy="31" r="1.2" />
      </g>)}
      <path d="m47 19 16-5 8 5-16 5Z" fill="var(--system-light)" opacity=".65" />
    </g>}
    {type === 'database' && <g>
      <path d="M29 24c0-7 52-7 52 0v36c0 14-52 14-52 0Z" fill={face} stroke="#709b80" strokeWidth=".7" />
      <ellipse cx="55" cy="24" rx="26" ry="10" fill={top} stroke="#a3c995" strokeWidth=".7" />
      <ellipse cx="55" cy="24" rx="17" ry="5" stroke="#c2e8a4" strokeWidth=".6" opacity=".55" />
      <path d="M29 36c0 13 52 13 52 0M29 49c0 13 52 13 52 0" stroke="#78aa86" strokeWidth=".8" />
      <path d="M35 35v7m0 7v6m0 7v4" stroke="var(--system-light)" strokeWidth="1.6" />
      <circle className="object-light" cx="71" cy="62" r="1.4" />
    </g>}
    {type === 'cloud' && <g>
      <path d="m34 52 23-6 21 8v8l-24 8-20-9Z" fill={face} stroke="#739d81" strokeWidth=".6" />
      <path d="m34 52 23-6 21 8-24 8Z" fill={top} stroke="#a4cfa2" strokeWidth=".6" />
      <path d="M35 44c-11 0-16-7-13-16 2-6 7-9 14-8 2-10 17-16 27-9 4 2 7 7 7 11 10-3 18 3 18 11 0 7-5 11-13 11Z" fill={face} stroke="#aed6b2" strokeWidth="1" />
      <path d="m48 34 8-8 8 8m-8-8v24" stroke="var(--system-light)" strokeWidth="1.6" />
      <path d="M56 64v8m-4-1 4 3 4-3" stroke="var(--system-light)" strokeWidth="1" />
    </g>}
    {type === 'source' && <g>
      <path d="m25 16 52-9 7 6v49l-52 13-7-6Z" fill="#071710" stroke="#669280" strokeWidth=".7" />
      <path d="m32 22 52-9v49L32 75Z" fill={face} stroke="#a1cabb" strokeWidth=".7" />
      <path d="m47 35 1 23m0-12 15-4v-9" stroke="var(--system-light)" strokeWidth="1.8" />
      {[[47,32], [48,60], [63,30]].map(([cx, cy]) => <circle key={cy} cx={cx} cy={cy} r="3.2" fill="#16382b" stroke="var(--system-light)" strokeWidth="1.3" />)}
      <path d="m39 27 7-1m4-1 7-1m4-1 7-1" stroke="#638b75" />
    </g>}
    {type === 'build' && <g>
      {[[0, 18], [27, 10], [13, -10]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
        <path d="m23 34 24-7 15 10v19l-24 8-15-10Z" fill={face} stroke="#73a88a" strokeWidth=".7" />
        <path d="m23 34 24-7 15 10-24 8Z" fill={top} stroke="#a5c7a3" strokeWidth=".7" />
        <path d="M38 45v19l24-8V37Z" fill="#103325" stroke="#6e9b7e" strokeWidth=".5" />
        <path d="m44 46 12-4m-12 8 12-4m-12 8 12-4" stroke="var(--system-light)" opacity=".5" />
      </g>)}
    </g>}
    {type === 'validate' && <g>
      <path d="m52 9 29 10v24c0 16-19 29-24 31-5-2-25-12-25-28V22Z" fill="#07170f" stroke="#5e9675" strokeWidth=".8" />
      <path d="m57 10 29 10v24c0 16-24 31-29 33-5-2-24-14-24-30V22Z" fill={face} stroke="#a4cfa8" strokeWidth=".9" />
      <path d="m57 19 20 8v17c0 10-13 20-20 25-7-5-16-12-16-23V28Z" fill={top} opacity=".4" />
      <path d="m46 44 8 7 14-18" stroke="var(--system-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>}
  </svg>;
}

function ArchitectureVisualization({ architecture }) {
  const [active, setActive] = useState(null);
  return <figure className="architecture ambient" aria-label={architecture.label}>
    <div className="architecture-topline"><span><i className="status-dot" />{architecture.label}</span><span>PROPOSED SYSTEM</span></div>
    <div className={`architecture-space${active !== null ? ' path-active' : ''}`}>
      <div className="architecture-grid" aria-hidden="true" />
      <svg className="architecture-links" viewBox="0 0 520 320" preserveAspectRatio="none" aria-hidden="true">
        <path className="connection-base" d="M124 76H396V244H124Z" />
        <path className="connection-flow" pathLength="1000" d="M124 76H396V244H124Z" />
        <path className="connection-cross" d="m124 76 272 168m0-168L124 244" />
        <path className="connection-arrow" d="m256 72 6 4-6 4m136 76 4 6 4-6m-138 84-6 4 6 4m-142-84 4-6 4 6" />
      </svg>
      <div className="architecture-center" aria-hidden="true"><span>{architecture.center[0]}</span><small>{architecture.center[1]}</small></div>
      <ol className="architecture-nodes">
        {architecture.stages.map(([type, title, technology, description], i) => <li key={title} style={{ gridArea: `stage${i}` }}>
          <button type="button" className={`system-node${active === i ? ' highlighted' : ''}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-label={`${i + 1}. ${title}: ${technology}. ${description}`}>
            <span className="node-index">0{i + 1}</span>
            <StageArtwork type={type} />
            <span className="node-copy"><strong>{title}</strong><small>{technology}</small></span>
            <span className="node-port" aria-hidden="true" />
          </button>
        </li>)}
      </ol>
    </div>
    <figcaption><span className="architecture-caption-mark" aria-hidden="true" />{active === null ? 'Every layer connected. Every step considered.' : architecture.stages[active][3]}</figcaption>
  </figure>;
}

export default function FullStackSection({ onProject }) {
  return <section id="systems" className="section full-stack-section"><div className="container">
    <Reveal className="section-topline section-label"><p className="eyebrow"><span className="section-number">04 /</span> FULL-STACK & SYSTEMS</p><span className="section-aside">BEYOND THE INTERFACE.</span></Reveal>
    <Reveal className="systems-heading"><h2>Complete systems.<br /><em>Real-world solutions.</em></h2><p>From frontend to backend, data to deployment.<br />Two concepts that connect the whole picture.</p></Reveal>
    <div className="system-projects">{fullStackProjects.map((project, i) => <Reveal className="system-project glass" key={project.id}>
      <div className="system-project-copy">
        <span className="system-kicker"><span>0{i + 1}</span>{project.category.toUpperCase()} CONCEPT</span>
        <h3>{project.name}<span>.</span></h3>
        <p>{project.description}</p>
        <div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>
        <ul className="system-features">{architectures[i].features.map(f => <li key={f}><Check size={12} />{f}</li>)}</ul>
        <Button variant="text" onClick={() => onProject(project)}>Explore the architecture <ArrowUpRight size={15} /></Button>
        <span className="system-detail">{architectures[i].detail}</span>
      </div>
      <ArchitectureVisualization architecture={architectures[i]} />
    </Reveal>)}</div>
  </div></section>;
}
