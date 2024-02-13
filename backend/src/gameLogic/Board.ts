import { DEFAULT_BOARD_SIZE } from "../../../web/src/common/constants"
import { Move } from "../../../web/src/common/types"
import {
  initializeBoard,
  slideTiles,
  spawnTile,
  movePossible,
} from "./boardUtils"

// TODO get rid of "Board" and "board" naming

export default class Board {
  playerId: string
  score: number
  board: number[][]
  nextMovePossible: boolean

  constructor(playerId: string) {
    this.playerId = playerId
    this.nextMovePossible = true
  }

  initialize() {
    this.board = initializeBoard(DEFAULT_BOARD_SIZE)
    this.score = 0
  }

  handleMove(move: Move) {
    this.board = slideTiles(this.board, move)
    this.board = spawnTile(this.board)
    this.nextMovePossible = movePossible(this.board)
  }
}
