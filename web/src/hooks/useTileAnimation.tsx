import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import parseTileGridState from "../utils/parseTileGridState"
import { TileGrid } from "../common/types"
import { MutableRefObject } from "react"

export type UseTileAnimationProps = {
  containerRef: MutableRefObject<null>
  currentTileGrid: TileGrid
  previousTileGrid: TileGrid
  tileSize: number
  gapSize: number
}

export default function useTileAnimation({
  containerRef,
  currentTileGrid,
  previousTileGrid,
  tileSize,
  gapSize,
}: UseTileAnimationProps) {
  useGSAP(
    () => {
      for (let yIndex = 0; yIndex < 4; yIndex++) {
        for (let xIndex = 0; xIndex < 4; xIndex++) {
          const details = parseTileGridState(currentTileGrid)

          const oldValue = previousTileGrid[yIndex][xIndex]
          const info = details[yIndex][xIndex]
          if (oldValue === 0 || !info.prevPosition) continue

          const [prevXIndex, prevYIndex] = info.prevPosition
          const newXDiff = `${(xIndex - prevXIndex) * (tileSize + gapSize)}px`
          const newYDiff = `${(yIndex - prevYIndex) * (tileSize + gapSize)}px`

          const tileSelector = `.tile-${prevXIndex}-${prevYIndex}`
          gsap.to(tileSelector, {
            x: newXDiff,
            y: newYDiff,
            duration: 0.5,
          })
        }
      }
    },
    { scope: containerRef, dependencies: [currentTileGrid], revertOnUpdate: true }
  )
}
