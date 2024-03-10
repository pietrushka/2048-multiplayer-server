import { useEffect, useCallback, useRef } from "react"
import { DIRECTIONS, Direction } from "shared-logic"

type Point = {
  x: number
  y: number
}

export default function useControlInput(handleMove: (direction: Direction) => void) {
  const startPointerLocation = useRef<Point>()

  useEffect(() => {
    const handleKeyboardInput = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case "ArrowDown":
          handleMove(DIRECTIONS.DOWN)
          break
        case "ArrowUp":
          handleMove(DIRECTIONS.UP)
          break
        case "ArrowLeft":
          handleMove(DIRECTIONS.LEFT)
          break
        case "ArrowRight":
          handleMove(DIRECTIONS.RIGHT)
          break
      }
    }
    window.addEventListener("keydown", handleKeyboardInput)
    return () => window.removeEventListener("keydown", handleKeyboardInput)
  }, [handleMove])

  const handleTouchMove = useCallback(
    (startPoint: Point, endPoint: Point) => {
      const dx = endPoint.x - startPoint.x
      const dy = endPoint.y - startPoint.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < 20) return

      if (absDx > absDy) {
        handleMove(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
      } else {
        handleMove(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP)
      }
    },
    [handleMove]
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
    [handleTouchMove]
  )

  return { onTouchStart, onTouchEnd }
}
