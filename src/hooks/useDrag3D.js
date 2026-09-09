import { useCallback, useRef, useState } from 'react'

const clamp = (value, [min, max]) => Math.min(max, Math.max(min, value))

/**
 * Pointer-drag-to-rotate hook. Returns a rotation {x, y} in degrees and the
 * pointer handlers needed to drive it, clamped to the given ranges.
 */
export function useDrag3D({
  initial = { x: 0, y: 0 },
  sensitivity = 0.35,
  clampX = [-90, 90],
  clampY = [-90, 90],
} = {}) {
  const [rotation, setRotation] = useState(initial)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0, rotX: initial.x, rotY: initial.y })

  const onPointerDown = useCallback(
    (event) => {
      setDragging(true)
      start.current = {
        x: event.clientX,
        y: event.clientY,
        rotX: rotation.x,
        rotY: rotation.y,
      }
      event.currentTarget.setPointerCapture?.(event.pointerId)
    },
    [rotation],
  )

  const onPointerMove = useCallback(
    (event) => {
      setDragging((isDragging) => {
        if (!isDragging) return isDragging
        const dx = event.clientX - start.current.x
        const dy = event.clientY - start.current.y
        setRotation({
          x: clamp(start.current.rotX - dy * sensitivity, clampX),
          y: clamp(start.current.rotY + dx * sensitivity, clampY),
        })
        return isDragging
      })
    },
    [sensitivity, clampX, clampY],
  )

  const onPointerUp = useCallback(() => setDragging(false), [])

  return { rotation, setRotation, dragging, onPointerDown, onPointerMove, onPointerUp }
}
