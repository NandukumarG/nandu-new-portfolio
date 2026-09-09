import { useCallback, useRef } from 'react'
import Reveal from './Reveal'
import {
  AwsIcon,
  DockerIcon,
  FastApiIcon,
  GitIcon,
  GithubIcon,
  KubernetesIcon,
  MongoIcon,
  NginxIcon,
  PostgresIcon,
  PostmanIcon,
  PythonIcon,
  ReactIcon,
  TailwindIcon,
  TypeScriptIcon,
  ViteIcon,
  VsCodeIcon,
} from './icons'
import './Tools.css'

const GROUPS = [
  {
    title: 'Frontend',
    items: [
      { Icon: ReactIcon, label: 'React' },
      { Icon: TypeScriptIcon, label: 'TypeScript' },
      { Icon: ViteIcon, label: 'Vite' },
      { Icon: TailwindIcon, label: 'Tailwind CSS' },
    ],
  },
  {
    title: 'Backend + Data',
    items: [
      { Icon: PythonIcon, label: 'Python' },
      { Icon: FastApiIcon, label: 'FastAPI' },
      { Icon: PostgresIcon, label: 'PostgreSQL' },
      { Icon: MongoIcon, label: 'MongoDB' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { Icon: AwsIcon, label: 'AWS' },
      { Icon: DockerIcon, label: 'Docker' },
      { Icon: KubernetesIcon, label: 'Kubernetes' },
      { Icon: NginxIcon, label: 'Nginx' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { Icon: VsCodeIcon, label: 'VS Code' },
      { Icon: GitIcon, label: 'Git' },
      { Icon: GithubIcon, label: 'GitHub' },
      { Icon: PostmanIcon, label: 'Postman' },
    ],
  },
]

const STAGES = ['Discover', 'Prototype', 'Integrate', 'Deploy', 'Iterate']

export default function Tools() {
  const gridRef = useRef(null)

  const handlePointerMove = useCallback((event) => {
    const grid = gridRef.current
    if (!grid) return
    const rect = grid.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    grid.style.setProperty('--tilt-x', `${(-py * 4).toFixed(2)}deg`)
    grid.style.setProperty('--tilt-y', `${(px * 4).toFixed(2)}deg`)
  }, [])

  const handlePointerLeave = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    grid.style.setProperty('--tilt-x', '0deg')
    grid.style.setProperty('--tilt-y', '0deg')
  }, [])

  return (
    <section id="stack" className="tools">
      <Reveal as="h2" className="tools-heading">
        The tools behind the work.
      </Reveal>

      <div
        className="tools-grid"
        ref={gridRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {GROUPS.map((group, index) => (
          <Reveal as="div" className="tools-group" key={group.title} delay={index * 80}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map(({ Icon, label }) => (
                <li key={label}>
                  <span className="tools-icon">
                    <Icon />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="tools-marquee" aria-hidden="true">
        <div className="tools-marquee-track">
          {[...STAGES, ...STAGES].map((stage, i) => (
            <span key={`${stage}-${i}`}>{stage}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
