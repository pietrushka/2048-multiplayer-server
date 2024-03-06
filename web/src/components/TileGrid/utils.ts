import { TileAnimationData } from "./parseTileGridState"
import { ANIMATION_TIME, borderRadiusToTileRatio, gapToTileRatio } from "./styles"

export const calcTileAndGapSize = (width: number) => {
  const tileSize = width / (4 + 5 * gapToTileRatio)
  const gapSize = tileSize * gapToTileRatio

  const borderRadius = width * borderRadiusToTileRatio

  return { tileSize, gapSize, borderRadius }
}

function calcPositionIndexDiff(
  { xIndex, yIndex, prevXIndex, prevYIndex }: TileAnimationData,
  tileSize: number,
  gapSize: number
) {
  if (xIndex === prevXIndex && yIndex === prevYIndex) return

  const xDiff = prevXIndex - xIndex
  const yDiff = prevYIndex - yIndex
  return { xDiff, yDiff }
}

export function getAnimations(data: TileAnimationData, tileSize: number, gapSize: number) {
  const positionDiff = calcPositionIndexDiff(data, tileSize, gapSize)

  const animations = []
  if (positionDiff) {
    const { xDiff, yDiff } = positionDiff
    animations.push(`move_xDiff${xDiff}_yDiff${yDiff} ${ANIMATION_TIME.singleAnimationTime}s forwards`)
  }

  if (data.isNew) {
    animations.push(
      `tileSpawn ${ANIMATION_TIME.singleAnimationTime}s forwards ${ANIMATION_TIME.newTileAnimationDelay}s`
    )
  }

  if (data.mergedInto) {
    animations.push(`mergeTile ${ANIMATION_TIME.mergeAnimationTime}s forwards ${ANIMATION_TIME.mergeAnimationDelay}s`)
  }

  return animations
}
