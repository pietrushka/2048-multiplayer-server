import React, { useEffect, useCallback, useRef } from "react"
import styled from "@emotion/styled"

import { MOVES } from "../common/constants"
import Tile from "./Tile"
import { Point } from "../types/Models"
import { Move } from "../common/types"

type PlayerBoardProps = {
  performMove: (move: Move) => void
  tileGrid: number[][]
}

export default function TileGrid({ performMove, tileGrid }: PlayerBoardProps) {
  const startPointerLocation = useRef<Point>()
  const currentPointerLocation = useRef<Point>()

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
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

    window.addEventListener("keydown", keydownListener)

    return () => {
      window.removeEventListener("keydown", keydownListener)
    }
  }, [performMove])

  const finishPointer = useCallback(
    (a: Point, b: Point) => {
      const distance = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2)
      if (distance < 20) {
        return
      }
      // angle in degrees (Math.atan2 returns andgle in radians)
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      if (angle < -135 || angle > 135) {
        performMove(MOVES.LEFT)
      } else if (angle < -45) {
        performMove(MOVES.UP)
      } else if (angle < 45) {
        performMove(MOVES.RIGHT)
      } else if (angle < 135) {
        performMove(MOVES.DOWN)
      }
    },
    [performMove]
  )

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    if (touch) {
      const point: Point = { x: touch.pageX, y: touch.pageY }
      startPointerLocation.current = point
    }
  }, [])
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    if (touch) {
      const point: Point = { x: touch.pageX, y: touch.pageY }
      currentPointerLocation.current = point
    }
  }, [])
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (startPointerLocation.current && currentPointerLocation.current) {
        finishPointer(startPointerLocation.current, currentPointerLocation.current)
      }

      startPointerLocation.current = undefined
      currentPointerLocation.current = undefined
    },
    [finishPointer]
  )

  return (
    <BoardContainer onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <Board>
        {tileGrid.flat().map((value: number, idx: number) => (
          <Tile key={idx} value={value} />
        ))}
      </Board>
    </BoardContainer>
  )
}

const BoardContainer = styled.div`
  width: 100%;
  margin-bottom: 5%;
  margin: 0 auto;
`
const Board = styled.div`
  margin: auto;
  width: 90%;
  position: relative;
  background: #bbada0;
  border-radius: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  padding: 0.5rem;
  user-select: none;
  touch-action: none;
`
