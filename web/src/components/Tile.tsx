import styled from "@emotion/styled"
import { SerializedStyles, css } from "@emotion/react"
import { TileGridSize } from "../types"
import { TileValue, NonEmptyTileValue } from "../common/types"

interface TileProps {
  value: TileValue
  size?: TileGridSize
}

const Tile: React.FC<TileProps> = ({ value, size = "normal" }) => {
  return <Cell size={size}>{value !== 0 && <CellInner value={value}>{value}</CellInner>}</Cell>
}

export default Tile

interface CellProps {
  size: TileGridSize
}

const Cell = styled.div<CellProps>`
  position: relative;
  padding-bottom: 100%;
  background: #cdc1b4;
  line-height: 0;
  ${({ size }) => (size === "small" ? styleSmall : styleNormal)}
`

const CellInner = styled.div<{ value: NonEmptyTileValue }>`
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
  ${({ value }) => tilesColors[value] || defaultTileStyle}
`

const styleSmall = css`
  border-radius: 1px;
  font-size: 0.6rem;
`

const styleNormal = css`
  border-radius: 3px;
  font-size: 1.6rem;
`

const defaultTileStyle = css`
  font-size: 1.7em; // Default font size for unspecified values
`

const tilesColors: Record<NonEmptyTileValue, SerializedStyles> = {
  2: css`
    background: #eee4da;
    color: #776e65;
  `,
  4: css`
    background: #ede0c8;
    color: #776e65;
  `,

  8: css`
    background: #f2b179;
  `,

  16: css`
    background: #f59563;
  `,

  32: css`
    background: #f67c5f;
  `,

  64: css`
    background: #f65e3b;
  `,

  128: css`
    background: #edcf72;
  `,

  256: css`
    background: #edcc61;
  `,

  512: css`
    background: #edc850;
  `,

  1024: css`
    background: #edc53f;
  `,

  2048: css`
    background: #edc22e;
  `,
}
