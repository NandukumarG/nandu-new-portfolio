import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Fires `visible = true` once the ref'd element crosses into the viewport,
 * then disconnects. Respects reduced-motion by starting visible.
 */
export function useScrollReveal(options) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px', ...options },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, visible]
}
