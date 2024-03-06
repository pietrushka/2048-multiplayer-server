// Board is an controllable TileGrid
import TileGrid from "./TileGrid"
import { Direction, Move } from "../common/types"
import useControlInput from "../hooks/useControlInput"

type TileGridProps = {
  performMove: (move: Move) => void
  direction?: Direction
  tileGridString: string
}

export default function Board({ performMove, tileGridString, direction }: TileGridProps) {
  const { onTouchStart, onTouchEnd } = useControlInput(performMove)
  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TileGrid tileGridString={tileGridString} direction={direction} />
    </div>
  )
}
