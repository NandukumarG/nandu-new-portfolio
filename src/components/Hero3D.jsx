import { useEffect, useRef, useState } from 'react'
import './Hero3D.css'

/** Decorative, fixed-camera system model. Rendering loads separately from the page. */
export default function Hero3D() {
  const host = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = host.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let scene
    let visible = false
    const sync = () => scene?.setActivity(visible && !document.hidden, motion.matches)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    }, { threshold: 0 })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)

    import('./hero-system/createHeroSystem.js').then(({ createHeroSystem }) => {
      if (disposed) return
      scene = createHeroSystem(element, {
        onReady: () => { if (!disposed) setReady(true) },
        onUnavailable: () => { if (!disposed) setReady(false) },
      })
      sync()
    }).catch(() => { if (!disposed) setReady(false) })

    return () => {
      disposed = true
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', sync)
      scene?.dispose()
    }
  }, [])

  return (
    <div className="stack3d-wrap">
      <div
        ref={host}
        className={`hero-system${ready ? ' is-ready' : ''}`}
        role="img"
        aria-label="An ivory and forest-glass miniature software system: a dashboard monitor connects through a gateway and API tower to a database, three servers, and a deployment cloud. Lime signals follow the connecting pipes."
      >
        <img className="hero-system-preview" src="/images/hero-system-preview.png" alt="" aria-hidden="true" fetchPriority="high" />
      </div>
    </div>
  )
}
