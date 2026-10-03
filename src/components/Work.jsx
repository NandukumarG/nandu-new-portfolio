import { useState } from 'react';
import Reveal from './Reveal';
import Carousel from './Carousel';
import Button from './Button';
import { staticProjects, workFilters } from '../data/portfolio';
import './Work.css';
export default function Work({ onProject, suspended }) {
  const [filter, setFilter] = useState('All');
  const filtered = staticProjects.filter(p => filter === 'All' || p.category === filter);
  return <section id="work" className="section work-section">
    <div className="container">
      <Reveal className="section-topline section-label"><p className="eyebrow"><span className="section-number">03 /</span> WORK</p><span className="section-aside">A LITTLE CURIOSITY. A LOT OF POSSIBILITY.</span></Reveal>
      <Reveal className="work-heading"><h2>Explore what I’ve <em>built.</em></h2><div className="work-filter" aria-label="Filter projects">{workFilters.map(f => <Button variant={filter === f ? 'primary' : 'glass'} key={f} aria-pressed={filter === f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</Button>)}</div></Reveal>
      <p className="work-intro">A collection of web experiences, interfaces, experiments, and engineering work created through curiosity, problem-solving, and hands-on development.</p>
    </div>
    <Carousel key={filter} projects={filtered} onProject={onProject} suspended={suspended} />
    <div className="container work-footnote"><span>DESIGN STUDIES & CONCEPT PROJECTS</span><span>Built around ideas. Made for people.</span></div>
  </section>;
}
