// Board is an controllable TileGrid
import { Move } from "shared-logic"
import TileGrid from "./TileGrid"
import useControlInput from "../hooks/useControlInput"

type TileGridProps = {
  performMove: (move: Move) => void
  tileGridStateEncoded: string
}

export default function Board({ performMove, tileGridStateEncoded }: TileGridProps) {
  const { onTouchStart, onTouchEnd } = useControlInput(performMove)
  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TileGrid tileGridStateEncoded={tileGridStateEncoded} />
    </div>
  )
}
