import styled from "@emotion/styled"
import { css } from "@emotion/react"
import Tile from "./Tile"
import { TileGridSize } from "../types"
import { TileGrid } from "../common/types"

interface GridDisplayProps {
  size: TileGridSize
}

type TileGridDisplayProps = {
  tileGrid: TileGrid
  size: TileGridSize
}

const BaseGrid = styled.div`
  position: relative;
  background: #bbada0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  user-select: none;
  touch-action: none;
`

const GridDisplay = styled(BaseGrid)<GridDisplayProps>`
  ${({ size }) =>
    size === "normal"
      ? css`
          width: 90%;
          margin: 0 auto;
          border-radius: 6px;
          margin-bottom: 5%;
          grid-gap: 0.5rem;
          padding: 0.5rem;
        `
      : css`
          width: 45%;
          border-radius: 2px;
          grid-gap: 0.15rem;
          padding: 0.15rem;
        `}
`

export default function TileGridDisplay({ tileGrid, size }: TileGridDisplayProps) {
  return (
    <GridDisplay size={size}>
      {tileGrid.flatMap((row, x) => row.map((value, y) => <Tile key={`${x}-${y}`} value={value} size={size} />))}
    </GridDisplay>
  )
}
