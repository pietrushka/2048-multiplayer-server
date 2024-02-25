import { forwardRef } from "react"
import styled from "@emotion/styled"
import { SerializedStyles, css } from "@emotion/react"
import { TileValue, NonEmptyTileValue } from "../common/types"

type TileInnerProps = {
  value: TileValue
  sideLength: number
  xIndex: number
  yIndex: number
}

export const StyledTile = styled.div<TileInnerProps>`
  ${({ value }) =>
    value === 0
      ? css`
          display: none;
        `
      : tilesColors[value]}

  ${({ sideLength, xIndex, yIndex }) => css`
    width: ${sideLength}px;
    height: ${sideLength}px;
    left: ${10 + xIndex * (sideLength + 10)}px;
    top: ${10 + yIndex * (sideLength + 10)}px;
  `}

  position: absolute;
  z-index: 10;
  border-radius: 3px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Wrap the styled component with forwardRef to forward the ref to the DOM element
const Tile = forwardRef<HTMLDivElement, TileInnerProps>((props, ref) => {
  return <StyledTile ref={ref} {...props} />
})

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

export default Tile
