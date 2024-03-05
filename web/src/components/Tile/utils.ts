import { TileAnimationData } from "../../utils/parseTileGridState"
import { tileSize, gapSize, ANIMATION_TIME } from "./constants"

function calcPositionDiff({ xIndex, yIndex, prevXIndex, prevYIndex }: TileAnimationData) {
  if (xIndex === prevXIndex && yIndex === prevYIndex) return null

  const xDiff = (prevXIndex - xIndex) * (tileSize + gapSize)
  const yDiff = (prevYIndex - yIndex) * (tileSize + gapSize)
  return { xDiff, yDiff }
}

export function getAnimations(data: TileAnimationData) {
  const animations = []

  const positionDiff = calcPositionDiff(data)
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
