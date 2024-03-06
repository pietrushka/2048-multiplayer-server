import styled from "@emotion/styled"
import { css, useTheme } from "@emotion/react"
import { tilesColorStyles } from "./styles"
import { getAnimations } from "./utils"
import { TileAnimationData } from "./parseTileGridState"
import { NonEmptyTileValue } from "../../common/types"

export default function Tile(props: TileAnimationData) {
  const theme = useTheme() // TODO check is this ok solution

  const animations = getAnimations(props, theme.tileSize, theme.gapSize)
  if (animations.length) {
    console.log(animations)
  }
  if (props.value === 0) return null
  return (
    <StyledTile
      id={`tile${props.id}`}
      xIndex={props.xIndex}
      yIndex={props.yIndex}
      value={props.value}
      mergedInto={props.mergedInto}
      borderRadius={theme.borderRadius}
      style={{
        ...(animations.length ? { animation: animations.join(", ") } : {}), // TODO refactor
        ...(props.mergedInto ? { zIndex: 2 } : {}),
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

const StyledTile = styled.div<{
  xIndex: number
  yIndex: number
  value: NonEmptyTileValue
  mergedInto: boolean
  borderRadius: number
}>`
  font-size: 2rem;
  position: absolute;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  border-radius: 3px;
  color: #f9f6f2;

  ${({ theme, xIndex, yIndex, value, borderRadius }) => css`
    width: ${theme.tileSize}px;
    height: ${theme.tileSize}px;
    top: ${yIndex * (theme.tileSize + theme.gapSize) + theme.gapSize}px;
    left: ${xIndex * (theme.tileSize + theme.gapSize) + theme.gapSize}px;
    border-radius: ${borderRadius}px;
    ${tilesColorStyles[value]}
  `}
`
