import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import styled from "@emotion/styled"
import { SerializedStyles, css } from "@emotion/react"
import { TileGridSize } from "../types"
import { TileValue, NonEmptyTileValue, Direction, TileGrid } from "../common/types"
import parseTileGridState from "../utils/parseTileGridState"

export type TilesProps = {
  tileGrid: TileGrid
  previousGrid: TileGrid
  size: TileGridSize
  direction: Direction
}

const tileSize = 150 // TODO handle tile size dynamically
const gapSize = 10

export default function TileGridDisplay({ tileGrid, previousGrid, size, direction }: TilesProps) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      for (let yIndex = 0; yIndex < 4; yIndex++) {
        for (let xIndex = 0; xIndex < 4; xIndex++) {
          const details = parseTileGridState(tileGrid)

          const oldValue = previousGrid[yIndex][xIndex]
          const info = details[yIndex][xIndex]
          if (oldValue === 0 || !info.prevPosition) continue

          const [prevXIndex, prevYIndex] = info.prevPosition
          const newXDiff = `${(xIndex - prevXIndex) * (tileSize + gapSize)}px`
          const newYDiff = `${(yIndex - prevYIndex) * (tileSize + gapSize)}px`

          const tileSelector = `.tile-${prevXIndex}-${prevYIndex}`
          gsap.to(tileSelector, {
            x: newXDiff,
            y: newYDiff,
            duration: 0.5,
          })
        }
      }
    },
    { scope: containerRef, dependencies: [tileGrid], revertOnUpdate: true }
  )

  return (
    <Board size={size} ref={containerRef}>
      {tileGrid.flatMap((row, yIndex) =>
        row.map((value, xIndex) => (
          <Cell key={`${xIndex}-${yIndex}`} tileSize={tileSize}>
            <Tile className={`tile-${xIndex}-${yIndex}`} key={`${xIndex}-${yIndex}`} value={value} />
          </Cell>
        ))
      )}
    </Board>
  )
}

const Board = styled.div<{ size: TileGridSize }>`
  position: relative;
  background: #bbada0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  user-select: none;
  touch-action: none;
  width: 650px;
  height: 650px;
  margin: 0 auto;
  border-radius: 6px;
  padding: 10px;
  grid-gap: 10px;
  box-sizing: border-box;
`

const Cell = styled.div<{ tileSize: number }>`
  position: relative;
  background: #cdc1b4;

  ${({ tileSize }) => css`
    width: ${tileSize}px;
    height: ${tileSize}px;
  `}
`

const Tile = styled.div<{ value: TileValue }>`
  background: #3c3a32;
  color: #f9f6f2;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  border-radius: 3px;
  z-index: 10;
  ${({ value }) =>
    value === 0
      ? css`
          display: none;
        `
      : tilesColors[value]}
`

const tilesColors: Record<NonEmptyTileValue, SerializedStyles> = {
  2: css`
    background-color: #eee4da;
    color: #776e65;
  `,
  4: css`
    background-color: #ede0c8;
    color: #776e65;
  `,
  8: css`
    background-color: #f2b179;
  `,
  16: css`
    background-color: #f59563;
  `,
  32: css`
    background-color: #f67c5f;
  `,
  64: css`
    background-color: #f65e3b;
  `,
  128: css`
    background-color: #edcf72;
  `,
  256: css`
    background-color: #edcc61;
  `,
  512: css`
    background-color: #edc850;
  `,
  1024: css`
    background-color: #edc53f;
  `,
  2048: css`
    background-color: #edc22e;
  `,
}
