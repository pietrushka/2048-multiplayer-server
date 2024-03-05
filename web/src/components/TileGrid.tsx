import styled from "@emotion/styled"
import TileGridDisplay from "./TileGridDisplay"
import { Direction, Move, TileGrid as TileGridT } from "../common/types"
import useControlInput from "../hooks/useControlInput"

type TileGridProps = {
  performMove: (move: Move) => void
  direction?: Direction
  tileGrid: TileGridT
}

export default function TileGrid({ performMove, tileGrid, direction }: TileGridProps) {
  const { onTouchStart, onTouchEnd } = useControlInput(performMove)
  return (
    <BoardContainer onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TileGridDisplay tileGrid={JSON.stringify(tileGrid)} direction={direction} />
    </BoardContainer>
  )
}

const BoardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5%;
`
