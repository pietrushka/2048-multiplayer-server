import { SerializedStyles, css } from "@emotion/react"
import { NonEmptyTileValue } from "shared-logic"

export const gapToTileRatio = 0.1
export const borderRadiusToTileGridRatio = 0.015
export const approxTileToFontSizeRatio = 0.45 // after rounding it might be slightly different

// TODO refactor
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

// ANIMATIONS
// time in seconds
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

const tilePercentageOfTileAndGapGroup = 100 + 100 * gapToTileRatio
const diff1TilePercentage = 1 * tilePercentageOfTileAndGapGroup
const diff2TilePercentage = 2 * tilePercentageOfTileAndGapGroup
const diff3TilePercentage = 3 * tilePercentageOfTileAndGapGroup

export const keyframesCss = css`
  @keyframes tileSpawn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes mergeTile {
    from {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes move_xDiff-3_yDiff-3 {
    from {
      transform: translate(-${diff3TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff-2 {
    from {
      transform: translate(-${diff3TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff-1 {
    from {
      transform: translate(-${diff3TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff0 {
    from {
      transform: translate(-${diff3TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff1 {
    from {
      transform: translate(-${diff3TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff2 {
    from {
      transform: translate(-${diff3TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-3_yDiff3 {
    from {
      transform: translate(-${diff3TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff-3 {
    from {
      transform: translate(-${diff2TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff-2 {
    from {
      transform: translate(-${diff2TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff-1 {
    from {
      transform: translate(-${diff2TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff0 {
    from {
      transform: translate(-${diff2TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff1 {
    from {
      transform: translate(-${diff2TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff2 {
    from {
      transform: translate(-${diff2TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-2_yDiff3 {
    from {
      transform: translate(-${diff2TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff-3 {
    from {
      transform: translate(-${diff1TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff-2 {
    from {
      transform: translate(-${diff1TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff-1 {
    from {
      transform: translate(-${diff1TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff0 {
    from {
      transform: translate(-${diff1TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff1 {
    from {
      transform: translate(-${diff1TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff2 {
    from {
      transform: translate(-${diff1TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff-1_yDiff3 {
    from {
      transform: translate(-${diff1TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff-3 {
    from {
      transform: translate(0px, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff-2 {
    from {
      transform: translate(0px, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff-1 {
    from {
      transform: translate(0px, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff0 {
    from {
      transform: translate(0px, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff1 {
    from {
      transform: translate(0px, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff2 {
    from {
      transform: translate(0px, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff0_yDiff3 {
    from {
      transform: translate(0px, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff-3 {
    from {
      transform: translate(${diff1TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff-2 {
    from {
      transform: translate(${diff1TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff-1 {
    from {
      transform: translate(${diff1TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff0 {
    from {
      transform: translate(${diff1TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff1 {
    from {
      transform: translate(${diff1TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff2 {
    from {
      transform: translate(${diff1TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff1_yDiff3 {
    from {
      transform: translate(${diff1TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff-3 {
    from {
      transform: translate(${diff2TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff-2 {
    from {
      transform: translate(${diff2TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff-1 {
    from {
      transform: translate(${diff2TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff0 {
    from {
      transform: translate(${diff2TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff1 {
    from {
      transform: translate(${diff2TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff2 {
    from {
      transform: translate(${diff2TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff2_yDiff3 {
    from {
      transform: translate(${diff2TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff-3 {
    from {
      transform: translate(${diff3TilePercentage}%, -${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff-2 {
    from {
      transform: translate(${diff3TilePercentage}%, -${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff-1 {
    from {
      transform: translate(${diff3TilePercentage}%, -${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff0 {
    from {
      transform: translate(${diff3TilePercentage}%, 0px);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff1 {
    from {
      transform: translate(${diff3TilePercentage}%, ${diff1TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff2 {
    from {
      transform: translate(${diff3TilePercentage}%, ${diff2TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }

  @keyframes move_xDiff3_yDiff3 {
    from {
      transform: translate(${diff3TilePercentage}%, ${diff3TilePercentage}%);
    }
    to {
      transform: translate(0px, 0px);
    }
  }
`
