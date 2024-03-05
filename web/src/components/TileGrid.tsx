import { useEffect, useCallback, useRef, useState } from "react"
import styled from "@emotion/styled"
import TileGridDisplay from "./TileGridDisplay"
import { MOVES } from "../common/constants"
import { Direction, Move, TileGrid as TileGridT } from "../common/types"
import { useInterval } from "../hooks/useInterval"

type Point = {
  x: number
  y: number
}

type TileGridProps = {
  performMove: (move: Move) => void
  direction?: Direction
  tileGrid: TileGridT
}

export default function TileGrid({ performMove, tileGrid, direction }: TileGridProps) {
  const startPointerLocation = useRef<Point>()

  useEffect(() => {
    const handleKeyboardInput = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case "ArrowDown":
          performMove(MOVES.DOWN)
          break
        case "ArrowUp":
          performMove(MOVES.UP)
          break
        case "ArrowLeft":
          performMove(MOVES.LEFT)
          break
        case "ArrowRight":
          performMove(MOVES.RIGHT)
          break
      }
    }
    window.addEventListener("keydown", handleKeyboardInput)
    return () => window.removeEventListener("keydown", handleKeyboardInput)
  }, [performMove])

  const handleTouchMove = useCallback(
    (startPoint: Point, endPoint: Point) => {
      const dx = endPoint.x - startPoint.x
      const dy = endPoint.y - startPoint.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < 20) return

      if (absDx > absDy) {
        performMove(dx > 0 ? MOVES.RIGHT : MOVES.LEFT)
      } else {
        performMove(dy > 0 ? MOVES.DOWN : MOVES.UP)
      }
    },
    [performMove]
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
  return (
    <BoardContainer onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TileGridDisplay tileGrid={JSON.stringify(tileGrid)} direction={direction} />
    </BoardContainer>
  )
}

const BoardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5%;
`
