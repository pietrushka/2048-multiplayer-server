import { SerializedStyles, css } from "@emotion/react"
import { NonEmptyTileValue } from "../../common/types"

// SIZE
// TODO handle tile size dynamically
export const tileSize = 150
export const gapSize = 10

// ANIMATIONS
const singleAnimationTime = 0.2
const newTileAnimationDelay = singleAnimationTime + 0.2 * singleAnimationTime
const mergeAnimationTime = singleAnimationTime
const mergeAnimationDelay = singleAnimationTime * 0.7
export const ANIMATION_TIME = {
  singleAnimationTime,
  newTileAnimationDelay,
  mergeAnimationTime,
  mergeAnimationDelay,
}

export const tilesColorStyles: Record<NonEmptyTileValue, SerializedStyles> = {
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
