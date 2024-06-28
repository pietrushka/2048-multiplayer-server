import { DEFAULT_BOARD_SIZE, OPERATIONS } from "../constants"
import { Move, BoardData, Direction } from "../types"
import { initializeBoard, slideTiles, spawnTile, movePossible, encodeTileGridState } from "./boardUtils"
import { deepCopyArray, areArraysEqual } from "../utils"
import { TileGrid } from "../types"

export class Board {
  playerId: string
  score: number
  tileGrid: TileGrid
  nextMovePossible: boolean
  previousMove?: Move

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
      tileGridStateEncoded: encodeTileGridState(this.tileGrid, this.previousMove),
    }
  }

  handleMove(move: Direction) {
    if (!this.nextMovePossible) {
      return
    }
    const oldTileGrid = deepCopyArray(this.tileGrid)
    const { scoreIncrease } = slideTiles(this.tileGrid, move)

    if (areArraysEqual(oldTileGrid, this.tileGrid)) {
      // move wasn't possible
      return
    }

    this.previousMove = move
    this.score += scoreIncrease
    spawnTile(this.tileGrid)
    this.nextMovePossible = movePossible(this.tileGrid)
  }

  reset() {
    this.previousMove = OPERATIONS.RESET
    this.nextMovePossible = true
    this.tileGrid = initializeBoard(DEFAULT_BOARD_SIZE)
    this.score = 0
  }
}
