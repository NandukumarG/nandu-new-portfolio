export default function ProjectPreview({ project }) {
  const Preview = project.url ? 'a' : 'div';
  return <Preview
    className={`project-preview preview-${project.id}`}
    {...(project.url ? { href: project.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Visit ${project.name} website in a new tab` } : {})}
  >
    <div className="preview-browser" aria-hidden="true"><span><i /><i /><i /></span><span>{project.name.toUpperCase()} / PROJECT</span><span>↗</span></div>
    {project.image ? <><img src={project.image} alt={project.alt} loading="lazy" decoding="async" width="1200" height="560" draggable="false" /><div className="preview-content" aria-hidden="true"><span className="preview-brand">{project.name.toUpperCase()}</span>{project.headline && <strong>{project.headline}</strong>}<small>VIEW PROJECT ↗</small></div></> : <div className="paper-art" role="img" aria-label={`${project.name}: thumbnail coming soon`}><strong>{project.name}.</strong><div className="paper-sheets" aria-hidden="true"><i /><i /><i /></div><span>THUMBNAIL COMING SOON</span></div>}
  </Preview>;
}
