import { DEFAULT_BOARD_SIZE, OPERATIONS } from "../constants"
import { Move, BoardData, Direction } from "../types"
import { initializeBoard, slideTiles, spawnTile, movePossible, encodeTileGridState } from "./boardUtils"
import { deepCopyArray, areArraysEqual } from "../utils"
import { TileGrid } from "../types"

export function processMove(tileGrid: TileGrid, direction: Direction) {
  const oldTileGrid = deepCopyArray(tileGrid)
  let scoreIncrease = 0
  let directionValid = true

  const slideResult = slideTiles(deepCopyArray(tileGrid), direction)

  scoreIncrease = slideResult.scoreIncrease
  const newTileGrid = slideResult.tileGrid

  if (areArraysEqual(oldTileGrid, newTileGrid)) {
    directionValid = false
    return {
      newTileGrid: oldTileGrid,
      scoreIncrease: 0,
      directionValid,
    }
  }

  return {
    newTileGrid,
    scoreIncrease,
    directionValid,
  }
}

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
      return { directionValid: false }
    }

    const { directionValid, scoreIncrease, newTileGrid } = processMove(this.tileGrid, move)
    if (!directionValid) {
      // move wasn't possible
      return { directionValid }
    }

    this.previousMove = move
    this.score += scoreIncrease
    this.tileGrid = newTileGrid
    spawnTile(this.tileGrid)
    this.nextMovePossible = movePossible(this.tileGrid)

    return { directionValid }
  }

  reset() {
    this.previousMove = OPERATIONS.RESET
    this.nextMovePossible = true
    this.tileGrid = initializeBoard(DEFAULT_BOARD_SIZE)
    this.score = 0
  }
}
