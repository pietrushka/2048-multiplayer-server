import { useEffect, useCallback, useRef } from "react"
import { DIRECTIONS, Direction } from "shared-logic"
import useDebounce from "./useDebounce"

type Point = {
  x: number
  y: number
}

const DEBOUNCE_DELAY_MS = 50

export default function useControlInput(handleMove: (direction: Direction) => void) {
  const startPointerLocation = useRef<Point>()
  const debouncedHandleMove = useDebounce(handleMove, DEBOUNCE_DELAY_MS)

  useEffect(() => {
    const handleKeyboardInput = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case "ArrowDown":
          debouncedHandleMove(DIRECTIONS.DOWN)
          break
        case "ArrowUp":
          debouncedHandleMove(DIRECTIONS.UP)
          break
        case "ArrowLeft":
          debouncedHandleMove(DIRECTIONS.LEFT)
          break
        case "ArrowRight":
          debouncedHandleMove(DIRECTIONS.RIGHT)
          break
      }
    }
    window.addEventListener("keydown", handleKeyboardInput)
    return () => window.removeEventListener("keydown", handleKeyboardInput)
  }, [debouncedHandleMove])

  const handleTouchMove = useCallback(
    (startPoint: Point, endPoint: Point) => {
      const dx = endPoint.x - startPoint.x
      const dy = endPoint.y - startPoint.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < 20) return

      if (absDx > absDy) {
        debouncedHandleMove(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
      } else {
        debouncedHandleMove(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP)
      }
    },
    [debouncedHandleMove],
  )

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    startPointerLocation.current = { x: touch.pageX, y: touch.pageY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0]
      const endPointerLocation: Point = { x: touch.pageX, y: touch.pageY }
      if (startPointerLocation.current) {
        handleTouchMove(startPointerLocation.current, endPointerLocation)
      }
    },
    [handleTouchMove],
  )

  return { onTouchStart, onTouchEnd }
}
