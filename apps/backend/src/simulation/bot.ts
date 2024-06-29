// todo remove on game end
import crypto from "crypto"
import simulateMove from "./index"
import MultiplayerGame from "../gameLogic/MultiplayerGame"
import { Direction } from "shared-logic"
import wait from "../utils/wait"

const MIN_WAIT_TIME = 500
const MAX_WAIT_TIME = 1100

export class Bot {
  playerIdentifier: string
  gameId: string | null
  userId = undefined
  game: MultiplayerGame | null = null
  handleMove: (move: Direction) => void = () => {}

  constructor() {
    this.playerIdentifier = crypto.randomUUID()
    this.gameId = null
  }

  setupGame(game: MultiplayerGame, handleMove: (move: Direction) => void) {
    this.game = game
    this.startMoveLoop()
    this.handleMove = handleMove
  }

  async startMoveLoop() {
    while (this.game?.status === "active") {
      await wait(MIN_WAIT_TIME + Math.random() * MAX_WAIT_TIME)
      const move = simulateMove() as Direction
      this.game.handleMove(move, this.playerIdentifier)
      this.handleMove(move)
    }
  }
}
