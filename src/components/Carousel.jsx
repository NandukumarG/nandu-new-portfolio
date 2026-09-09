import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import {
  DockerIcon,
  FastApiIcon,
  MongoIcon,
  PostgresIcon,
  ReactIcon,
} from './icons'
import './Carousel.css'

const PROJECTS = [
  {
    type: 'mockup',
    title: 'Operations Workspace',
    tag: 'FieldOps',
    description: 'A unified workspace for people, data and action.',
    stack: [
      { label: 'Frontend', value: 'React', Icon: ReactIcon },
      { label: 'Backend', value: 'FastAPI', Icon: FastApiIcon },
      { label: 'Database', value: 'PostgreSQL', Icon: PostgresIcon },
      { label: 'Deployment', value: 'Docker + AWS', Icon: DockerIcon },
    ],
  },
  {
    type: 'photo',
    image: '/images/forest-fieldops.jpg',
    title: 'FieldOps',
    tag: 'Sample project',
    description: 'Coordinate people, resources and progress from one board.',
    stack: [
      { label: 'Frontend', value: 'React', Icon: ReactIcon },
      { label: 'Database', value: 'MongoDB', Icon: MongoIcon },
    ],
  },
  {
    type: 'photo',
    image: '/images/lake-civicmaps.jpg',
    title: 'CivicMaps',
    tag: 'Sample project',
    description: 'Data for stronger communities.',
    stack: [
      { label: 'Frontend', value: 'React', Icon: ReactIcon },
      { label: 'Backend', value: 'FastAPI', Icon: FastApiIcon },
    ],
  },
]

const SWIPE_THRESHOLD = 60

export default function Carousel() {
  const [active, setActive] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const drag = useRef(null)

  const goTo = useCallback((next) => {
    setActive((PROJECTS.length + next) % PROJECTS.length)
  }, [])

  const onPointerDown = useCallback((event) => {
    drag.current = { startX: event.clientX, dragging: true }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event) => {
    if (!drag.current?.dragging) return
    setDragOffset(event.clientX - drag.current.startX)
  }, [])

  const endDrag = useCallback(() => {
    if (!drag.current?.dragging) return
    if (dragOffset > SWIPE_THRESHOLD) goTo(active - 1)
    else if (dragOffset < -SWIPE_THRESHOLD) goTo(active + 1)
    drag.current = null
    setDragOffset(0)
  }, [dragOffset, active, goTo])

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') goTo(active - 1)
      if (event.key === 'ArrowRight') goTo(active + 1)
    },
    [active, goTo],
  )

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        tabIndex={0}
        role="group"
        aria-label="Selected work carousel"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {PROJECTS.map((project, index) => {
          let offset = index - active
          if (offset > PROJECTS.length / 2) offset -= PROJECTS.length
          if (offset < -PROJECTS.length / 2) offset += PROJECTS.length
          const isActive = offset === 0
          const dragDeg = isActive ? dragOffset * 0.04 : 0

          return (
            <article
              key={project.title}
              className={`carousel-card${isActive ? ' is-active' : ''}${
                project.type === 'photo' ? ' carousel-card-photo' : ''
              }`}
              style={{
                '--offset': offset,
                '--card-photo': project.type === 'photo' ? `url(${project.image})` : undefined,
                transform: `translateX(calc(-50% + var(--offset) * 300px + ${
                  isActive ? dragOffset : 0
                }px)) translateZ(calc(var(--offset) * -1 * 80px)) rotateY(calc(var(--offset) * -22deg + ${dragDeg}deg)) scale(${
                  1 - Math.min(Math.abs(offset), 2) * 0.14
                })`,
                opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.32,
                zIndex: 10 - Math.abs(offset),
              }}
              aria-hidden={!isActive}
              onClick={() => !isActive && goTo(index)}
            >
              {project.type === 'mockup' && (
                <div className="carousel-mock">
                  <div className="carousel-mock-bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="carousel-mock-body">
                    <div className="carousel-mock-chart" />
                    <div className="carousel-mock-row" />
                    <div className="carousel-mock-row short" />
                  </div>
                </div>
              )}

              <div className="carousel-card-body">
                <h3>{project.title}</h3>
                <p className="carousel-tag">{project.tag}</p>
                <p className="carousel-desc">{project.description}</p>

                <ul className="carousel-stack">
                  {project.stack.map((item) => (
                    <li key={item.label}>
                      <span className="carousel-stack-icon">
                        <item.Icon />
                      </span>
                      <span>
                        <em>{item.label}</em>
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="carousel-links">
                  <a href="#work">
                    Explore project <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                  <a href="#work">
                    GitHub <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="carousel-controls">
        <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous project">
          <ChevronLeft size={18} />
        </button>
        <div className="carousel-progress">
          <span
            className="carousel-progress-fill"
            style={{ width: `${((active + 1) / PROJECTS.length) * 100}%` }}
          />
        </div>
        <span className="carousel-index">
          {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={() => goTo(active + 1)} aria-label="Next project">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
