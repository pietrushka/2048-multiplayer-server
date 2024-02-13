import { DEFAULT_BOARD_SIZE } from "../../../web/src/common/constants"
import { Move, BoardData } from "../../../web/src/common/types"
import { initializeBoard, slideTiles, spawnTile, movePossible } from "./boardUtils"

export default class Board {
  playerId: string
  score: number
  tileGrid: number[][]
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
    const { scoreIncrease } = slideTiles(this.tileGrid, move)
    this.score += scoreIncrease
    spawnTile(this.tileGrid)

    this.nextMovePossible = movePossible(this.tileGrid)
  }
}
