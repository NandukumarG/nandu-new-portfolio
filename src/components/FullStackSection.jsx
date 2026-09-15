import { ArrowUpRight, Check, Monitor, Server, Database, Cloud, GitBranch, Container, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Reveal from './Reveal';
import { fullStackProjects } from '../data/systems';
import './FullStackSection.css';
const architectures = [
  { label: 'APPLICATION ARCHITECTURE', features: ['Role-based access', 'Optimistic updates', 'Auditable activity'], stages: [[Monitor, 'Frontend', 'React', 'A focused interface for everyday operations.'], [Server, 'API & Backend', 'FastAPI', 'Services connect the interface to shared workflows.'], [Database, 'Database', 'PostgreSQL', 'A structured data model with an auditable activity stream.'], [Cloud, 'Deployment', 'Docker / AWS', 'Containerized delivery, as outlined in the original concept.']] },
  { label: 'DELIVERY ARCHITECTURE', features: ['Immutable containers', 'Health checks', 'Rollback path'], stages: [[GitBranch, 'Source', 'GitHub Actions', 'A source change starts the proposed delivery pipeline.'], [Container, 'Build', 'Docker', 'Build an immutable container artifact.'], [ShieldCheck, 'Validate', 'Staging / checks', 'Run checks before promoting the same artifact.'], [Cloud, 'Deploy', 'AWS', 'Release to production with health checks and a rollback path.']] },
];
function ArchitectureVisualization({ architecture }) {
  const [active, setActive] = useState(null);
  return <figure className="architecture ambient" aria-label={architecture.label}>
    <div className="architecture-topline"><span><i className="status-dot" /> {architecture.label}</span><span>PROPOSED SYSTEM</span></div>
    <div className={`architecture-space${active !== null ? ' path-active' : ''}`}>
      <div className="architecture-grid" aria-hidden="true" />
      <svg className="architecture-links" viewBox="0 0 520 275" preserveAspectRatio="none" aria-hidden="true"><path className="connection-base" d="M133 68 H389 V207 H133" /><path className="connection-flow" d="M133 68 H389 V207 H133" /><path className="connection-arrow" d="m252 64 6 4-6 4 M385 135l4 6 4-6 M263 203l-6 4 6 4" /></svg>
      <ol className="architecture-nodes">{architecture.stages.map(([Icon, title, technology, description], i) => <li key={title} style={{ gridArea: `stage${i}` }}><button className={`system-node${active === i ? ' highlighted' : ''}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-label={`${i+1}. ${title}: ${technology}. ${description}`}><span className="node-icon"><Icon size={24} strokeWidth={1.2} /></span><span className="node-copy"><strong>{title}</strong><small>{technology}</small></span><span className="node-index">0{i+1}</span></button></li>)}</ol>
    </div>
    <figcaption>{active === null ? 'Every layer connected. Every step considered.' : architecture.stages[active][3]}</figcaption>
  </figure>;
}
export default function FullStackSection({ onProject }) {
  return <section id="systems" className="section full-stack-section"><div className="container">
    <Reveal className="section-topline section-label"><p className="eyebrow"><span className="section-number">04 /</span> FULL-STACK & SYSTEMS</p><span className="section-aside">BEYOND THE INTERFACE.</span></Reveal>
    <Reveal className="systems-heading"><h2>Complete systems.<br /><em>Real-world solutions.</em></h2><p>From frontend to backend, data to deployment.<br />Two concepts that connect the whole picture.</p></Reveal>
    <div className="system-projects">{fullStackProjects.map((project,i) => <Reveal className="system-project glass" key={project.id}><div className="system-project-copy"><span className="system-kicker">0{i+1} / {project.category.toUpperCase()} CONCEPT</span><h3>{project.name}<span>.</span></h3><p>{project.description}</p><div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div><ul className="system-features">{architectures[i].features.map(f => <li key={f}><Check size={12} />{f}</li>)}</ul><button className="text-button" onClick={() => onProject(project)}>Explore the architecture <ArrowUpRight size={15} /></button></div><ArchitectureVisualization architecture={architectures[i]} /></Reveal>)}</div>
  </div></section>;
}