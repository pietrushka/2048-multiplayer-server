import { memo } from "react"
import styled from "@emotion/styled"
import { Direction } from "../common/types"
import parseTileGridState from "../utils/parseTileGridState"
import usePrevious from "../hooks/usePrevious"
import Tile from "./Tile"
import { tileSize } from "./Tile/constants"

export type TilesProps = {
  tileGrid: string
  direction?: Direction
}

function Background() {
  return (
    <>
      {Array.from({ length: 4 }, () => Array(4).fill(0)).flatMap((row, yIndex) =>
        row.map((value, xIndex) => <Cell key={`${xIndex}-${yIndex}`} />)
      )}
    </>
  )
}

function TileGridDisplay({ tileGrid, direction }: TilesProps) {
  const previousGrid = usePrevious(tileGrid)

  const gridState = parseTileGridState(tileGrid, previousGrid, direction).flat()
  return (
    <Board>
      <Background />
      {gridState.map((data) => (
        <Tile key={data.id} {...data} />
      ))}
    </Board>
  )
}

//TODO check why memoization breaks

export default memo(
  TileGridDisplay,
  (prevState: TilesProps, nextState: TilesProps) => prevState.tileGrid === nextState.tileGrid
)

const Board = styled.div`
  position: relative;
  background: #bbada0;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
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

const Cell = styled.div`
  position: relative;
  background: #cdc1b4;
  width: ${tileSize}px;
  height: ${tileSize}px;
`
