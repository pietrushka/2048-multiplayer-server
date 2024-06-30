import crypto from "crypto"
import simulateMove from "./index"
import MultiplayerGame from "../gameLogic/MultiplayerGame"
import wait from "../utils/wait"

const MIN_WAIT_TIME = 500
const MAX_WAIT_TIME = 1000

export class Bot {
  playerIdentifier: string
  gameId: string | null
  userId = undefined
  game: MultiplayerGame | null = null

  constructor() {
    this.playerIdentifier = crypto.randomUUID()
    this.gameId = null
  }

  setupGame(game: MultiplayerGame) {
    this.game = game
    this.startMoveLoop()
  }

  async startMoveLoop() {
    while (this.game?.status === "active") {
      await wait(MIN_WAIT_TIME + Math.random() * MAX_WAIT_TIME)
      const tileGrid = this.game.boards.find((board) => board.playerId === this.playerIdentifier)?.tileGrid!
      const move = simulateMove(tileGrid)
      this.game.handleMove(move, this.playerIdentifier)
    }
  }
}
