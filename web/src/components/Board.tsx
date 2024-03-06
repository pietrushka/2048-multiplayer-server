// Board is an controllable TileGrid
import TileGridDisplay from "./TileGrid"
import { Direction, Move, TileGrid as TileGridT } from "../common/types"
import useControlInput from "../hooks/useControlInput"

type TileGridProps = {
  performMove: (move: Move) => void
  direction?: Direction
  tileGrid: TileGridT
}

export default function Board({ performMove, tileGrid, direction }: TileGridProps) {
  const { onTouchStart, onTouchEnd } = useControlInput(performMove)
  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TileGridDisplay tileGrid={JSON.stringify(tileGrid)} direction={direction} />
    </div>
  )
}
