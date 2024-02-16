import { DEFAULT_BOARD_SIZE } from "../constants"
import { Move, BoardData } from "../types"
import { initializeBoard, slideTiles, spawnTile, movePossible } from "./boardUtils"
import { deepCopyArray, areArraysEqual } from "../utils"
import { TileGrid } from "../types"

export default class Board {
  playerId: string
  score: number
  tileGrid: TileGrid
  nextMovePossible: boolean

  constructor(playerId: string) {
    this.playerId = playerId
    this.nextMovePossible = true
    this.tileGrid = initializeBoard(DEFAULT_BOARD_SIZE)
    this.score = 0
  }
  get data(): BoardData {
    return {
      playerId: this.playerId,
      score: this.score,
      tileGrid: this.tileGrid,
    }
  }

  handleMove(move: Move) {
    const oldTileGrid = deepCopyArray(this.tileGrid)
    const { scoreIncrease } = slideTiles(this.tileGrid, move)

    if (areArraysEqual(oldTileGrid, this.tileGrid)) {
      // move wasn't possible
      return
    }

    this.score += scoreIncrease
    spawnTile(this.tileGrid)
    this.nextMovePossible = movePossible(this.tileGrid)
  }

  reset() {
    this.nextMovePossible = true
    this.tileGrid = initializeBoard(DEFAULT_BOARD_SIZE)
    this.score = 0
  }
}
