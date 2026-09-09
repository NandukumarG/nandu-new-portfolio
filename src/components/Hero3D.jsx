import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrag3D } from '../hooks/useDrag3D'
import './Hero3D.css'

const HALF_W = 150
const HALF_H = 76
const DEPTH = 48
const CX = 300

const LAYERS = [
  { id: 'interface', label: 'Interface', hint: 'React + design system', cy: 100 },
  { id: 'api', label: 'API', hint: 'FastAPI services', cy: 280 },
  { id: 'data', label: 'Data', hint: 'PostgreSQL + MongoDB', cy: 460 },
]

const AMBIENT_DOTS = [
  { x: 130, y: 30, r: 2, o: 0.5 },
  { x: 420, y: 20, r: 1.4, o: 0.4 },
  { x: 470, y: 60, r: 2.2, o: 0.5 },
  { x: 90, y: 70, r: 1.6, o: 0.35 },
  { x: 330, y: 10, r: 1.4, o: 0.3 },
  { x: 200, y: 190, r: 1.8, o: 0.4 },
  { x: 460, y: 210, r: 1.4, o: 0.35 },
  { x: 110, y: 230, r: 1.4, o: 0.3 },
  { x: 480, y: 380, r: 1.6, o: 0.3 },
  { x: 140, y: 400, r: 1.4, o: 0.25 },
  { x: 300, y: 560, r: 1.8, o: 0.3 },
  { x: 420, y: 540, r: 1.4, o: 0.25 },
]

const API_NODES = [
  { dx: -70, dy: -24, r: 4 },
  { dx: -28, dy: -42, r: 3 },
  { dx: 14, dy: -30, r: 5 },
  { dx: 55, dy: -8, r: 3 },
  { dx: -42, dy: 22, r: 3 },
  { dx: 18, dy: 32, r: 4 },
  { dx: 60, dy: 16, r: 3 },
]

const API_LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 6],
  [2, 5],
]

const pts = (points) => points.map((p) => p.join(',')).join(' ')

function slabFaces(cy) {
  const top = [
    [CX, cy - HALF_H],
    [CX + HALF_W, cy],
    [CX, cy + HALF_H],
    [CX - HALF_W, cy],
  ]
  const left = [
    [CX - HALF_W, cy],
    [CX, cy + HALF_H],
    [CX, cy + HALF_H + DEPTH],
    [CX - HALF_W, cy + DEPTH],
  ]
  const right = [
    [CX, cy + HALF_H],
    [CX + HALF_W, cy],
    [CX + HALF_W, cy + DEPTH],
    [CX, cy + HALF_H + DEPTH],
  ]
  return { top, left, right }
}

function InterfaceContent({ cy }) {
  return (
    <g className="iso-scene-content">
      <rect x={CX - 60} y={cy - 46} width="30" height="46" rx="3" className="iso-screen" />
      <rect x={CX - 6} y={cy - 34} width="26" height="34" rx="3" className="iso-screen iso-screen-alt" />
      <line x1={CX - 60} y1={cy - 34} x2={CX - 30} y2={cy - 34} className="iso-screen-line" />
      <line x1={CX - 6} y1={cy - 24} x2={CX + 20} y2={cy - 24} className="iso-screen-line" />
      <circle cx={CX + 40} cy={cy + 12} r="3" className="iso-node" />
      <circle cx={CX - 80} cy={cy + 16} r="2.4" className="iso-node" />
    </g>
  )
}

function ApiContent({ cy }) {
  return (
    <g className="iso-scene-content">
      {API_LINKS.map(([a, b]) => {
        const na = API_NODES[a]
        const nb = API_NODES[b]
        return (
          <line
            key={`${a}-${b}`}
            x1={CX + na.dx}
            y1={cy + na.dy}
            x2={CX + nb.dx}
            y2={cy + nb.dy}
            className="iso-link"
          />
        )
      })}
      {API_NODES.map((node, i) => (
        <circle
          key={i}
          cx={CX + node.dx}
          cy={cy + node.dy}
          r={node.r}
          className="iso-node"
        />
      ))}
    </g>
  )
}

function IsoCylinder({ cx, cy, w = 32, h = 34 }) {
  const rx = w / 2
  const ry = rx * 0.42
  return (
    <g className="iso-cylinder">
      <rect x={cx - rx} y={cy - h / 2} width={w} height={h} />
      <ellipse cx={cx} cy={cy + h / 2} rx={rx} ry={ry} className="iso-cylinder-base" />
      <ellipse cx={cx} cy={cy - h / 2} rx={rx} ry={ry} className="iso-cylinder-top" />
    </g>
  )
}

function DataContent({ cy }) {
  return (
    <g className="iso-scene-content">
      <rect x={CX - 96} y={cy - 30} width="16" height="16" className="iso-rack" />
      <rect x={CX + 70} y={cy - 22} width="14" height="14" className="iso-rack" />
      <IsoCylinder cx={CX - 55} cy={cy + 4} />
      <IsoCylinder cx={CX - 4} cy={cy - 8} w="28" h="30" />
      <IsoCylinder cx={CX + 46} cy={cy + 8} w="26" h="28" />
    </g>
  )
}

const CONTENT_BY_KEY = {
  interface: InterfaceContent,
  api: ApiContent,
  data: DataContent,
}

const BASE_ROTATION = { x: -10, y: -20 }

export default function Hero3D() {
  const { rotation, setRotation, dragging, onPointerDown, onPointerMove, onPointerUp } =
    useDrag3D({
      initial: BASE_ROTATION,
      sensitivity: 0.4,
      clampX: [-35, 15],
      clampY: [-65, 25],
    })
  const [active, setActive] = useState(0)
  const sceneRef = useRef(null)
  const idleBase = useRef(BASE_ROTATION)
  const wasDragging = useRef(false)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (wasDragging.current && !dragging) {
      idleBase.current = rotation
    }
    wasDragging.current = dragging
  }, [dragging, rotation])

  const handlePointerMove = useCallback(
    (event) => {
      if (dragging) {
        onPointerMove(event)
        return
      }
      if (reducedMotion.current) return
      const rect = sceneRef.current?.getBoundingClientRect()
      if (!rect) return
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      setRotation({
        x: idleBase.current.x - py * 8,
        y: idleBase.current.y + px * 14,
      })
    },
    [dragging, onPointerMove, setRotation],
  )

  const handlePointerLeave = useCallback(() => {
    onPointerUp()
    setRotation(idleBase.current)
  }, [onPointerUp, setRotation])

  return (
    <div className="stack3d-wrap">
      <div
        className={`stack3d${dragging ? ' is-dragging' : ''}`}
        ref={sceneRef}
        onPointerDown={onPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={handlePointerLeave}
        role="group"
        aria-label="Draggable system architecture diagram"
      >
        <div
          className="stack3d-scene"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          <svg viewBox="0 0 600 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <filter id="iso-blur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <filter id="iso-shadow-blur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {AMBIENT_DOTS.map((dot, i) => (
              <circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                className="iso-ambient-dot"
                style={{ opacity: dot.o }}
              />
            ))}

            {LAYERS.map((layer, index) => {
              const { top, left, right } = slabFaces(layer.cy)
              const Content = CONTENT_BY_KEY[layer.id]
              return (
                <g
                  key={layer.id}
                  className={`iso-layer iso-layer-${layer.id}${active === index ? ' is-active' : ''}`}
                  style={{ '--bob-delay': `${index * -1.4}s` }}
                  onClick={() => setActive(index)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active === index}
                  aria-label={`${layer.label} layer — ${layer.hint}`}
                >
                  <ellipse
                    cx={CX}
                    cy={layer.cy + HALF_H + DEPTH + 16}
                    rx={HALF_W * 0.82}
                    ry="16"
                    className="iso-shadow"
                    filter="url(#iso-shadow-blur)"
                  />
                  <polygon points={pts(right)} className="iso-face iso-face-right" />
                  <polygon points={pts(left)} className="iso-face iso-face-left" />
                  <polygon points={pts(top)} className="iso-face iso-face-top" />
                  <Content cy={layer.cy} />
                </g>
              )
            })}

            <circle
              cx={CX + 30}
              cy={LAYERS[2].cy + HALF_H + DEPTH + 46}
              r="5"
              className="iso-deploy-dot"
              filter="url(#iso-blur)"
            />
          </svg>
        </div>
      </div>

      <div className="stack3d-labels">
        {LAYERS.map((layer, index) => (
          <button
            type="button"
            key={layer.id}
            className={`stack3d-label${active === index ? ' is-active' : ''}`}
            onClick={() => setActive(index)}
          >
            <span className="stack3d-label-line" aria-hidden="true" />
            <span className="dot" aria-hidden="true" />
            <span className="stack3d-label-text">
              {layer.label}
              <em>{layer.hint}</em>
            </span>
          </button>
        ))}
      </div>

      <div className="stack3d-tag">
        <span className="stack3d-tag-line" aria-hidden="true" />
        <span className="dot" aria-hidden="true" />
        <span className="stack3d-tag-text">
          <strong>Deploy</strong>
          <em>Production · Docker + AWS</em>
        </span>
      </div>

      <p className="stack3d-hint">Drag to explore ↔</p>
    </div>
  )
}
