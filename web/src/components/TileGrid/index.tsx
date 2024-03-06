import { memo, useRef, useMemo } from "react"
import { ThemeProvider } from "@emotion/react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import Tile from "./Tile"
import parseTileGridState from "./parseTileGridState"
import usePrevious from "../../hooks/usePrevious"
import useResizeObserver from "../../hooks/useResizeObserver"
import { calcTileAndGapSize } from "./utils"
import { Direction } from "../../common/types"
import Background from "./Background"

export type TilesProps = {
  tileGridString: string
  direction?: Direction
}

function TileGrid({ tileGridString, direction }: TilesProps) {
  const boardRef = useRef(null)
  const previousGrid = usePrevious(tileGridString)

  const { width = 0 } = useResizeObserver({
    ref: boardRef,
    box: "border-box",
  })

  // TODO is this meme needed?
  const gridState = useMemo(
    () => parseTileGridState(tileGridString, previousGrid, direction).flat(),
    [tileGridString, previousGrid, direction]
  )

  const theme = calcTileAndGapSize(width)
  return (
    <Board ref={boardRef} gapSize={theme.gapSize} borderRadius={theme.borderRadius}>
      <ThemeProvider theme={theme}>
        <Background />
        {gridState.map((data) => (
          <Tile key={data.id} {...data} />
        ))}
      </ThemeProvider>
    </Board>
  )
}

export default memo(
  TileGrid,
  (prevState: TilesProps, nextState: TilesProps) => prevState.tileGridString === nextState.tileGridString
)

const Board = styled.div<{ gapSize: number; borderRadius: number }>`
  aspect-ratio: 1 / 1;
  position: relative;
  background: #bbada0;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  user-select: none;
  touch-action: none;

  ${({ gapSize, borderRadius }) => css`
    grid-gap: ${gapSize}px;
    padding: ${gapSize}px;
    border-radius: ${borderRadius}px;
  `}
`
