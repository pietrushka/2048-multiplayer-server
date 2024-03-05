import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { tileSize, tilesColorStyles, gapSize } from "./constants"
import { getAnimations } from "./utils"
import { TileAnimationData } from "../../utils/parseTileGridState"
import "./tile.css"
import { NonEmptyTileValue } from "../../common/types"

export default function Tile(props: TileAnimationData) {
  if (props.value === 0) return null

  const animations = getAnimations(props)

  return (
    <StyledTile
      xIndex={props.xIndex}
      yIndex={props.yIndex}
      value={props.value}
      style={{
        zIndex: props.mergedInto ? 2 : "1",
        animation: animations.join(", "),
        ...(props.isNew ? { transform: "scale(0)" } : {}),
      }}
    >
      {props.value}
    </StyledTile>
  )
}
//   const TileMemoized = memo(
//   (prevState: { data: TileAnimationData }, currentState: { data: TileAnimationData }) =>
//     prevState.data.xIndex === currentState.data.xIndex &&
//     prevState.data.yIndex === currentState.data.yIndex &&
//     prevState.data.value === currentState.data.value
// )

const StyledTile = styled.div<{ xIndex: number; yIndex: number; value: NonEmptyTileValue }>`
  width: ${tileSize}px;
  height: ${tileSize}px;
  font-size: 2rem;
  position: absolute;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  border-radius: 3px;
  color: #f9f6f2;

  ${({ xIndex, yIndex, value }) => css`
    top: ${yIndex * (tileSize + gapSize) + gapSize}px;
    left: ${xIndex * (tileSize + gapSize) + gapSize}px;
    ${tilesColorStyles[value]}
  `}
`
