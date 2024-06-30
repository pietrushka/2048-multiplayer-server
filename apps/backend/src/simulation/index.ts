import { TileGrid } from "shared-logic"
import simulateV0, { getRandomMove } from "./v0"

export enum Strategies {
  random = "random",
  v0 = "v0",
}

const strategiesMap = {
  [Strategies.random]: getRandomMove,
  [Strategies.v0]: simulateV0,
}

export default function simulateMove(gridArrays: TileGrid) {
  const strategyFn = strategiesMap[Strategies.v0]
  const move = strategyFn(gridArrays)
  return move
}
