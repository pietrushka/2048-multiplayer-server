import Board from "./Board"
import { GameState, Move } from "../../../web/src/common/types"
import { GAME_TIME } from "../../../web/src/common/constants"
import { movePossible } from "./boardUtils"

function addTimeToCurrentTimestamp(ms: number): string {
  const now = new Date()
  const later = new Date(now.getTime() + ms)
  return later.toISOString()
}

type handleGameEndPayload =
  | { reason: "timeEnd" }
  | { reason: "playerBlocked"; playerId: string }

export default class Game {
  id: string
  state: GameState
  endGameTimestamp: string
  socketIds: string[]
  boards: Record<string, Board>
  winner: string
  private gameEndTimeout

  constructor(socketIds: string[]) {
    this.id = `game_${Date.now()}`
    this.state = "loading"
    this.endGameTimestamp = null
    this.socketIds = socketIds
    this.boards = {
      [socketIds[0]]: new Board(socketIds[0]),
      [socketIds[1]]: new Board(socketIds[1]),
    }
  }

  get data() {
    return {
      state: this.state,
      endGameTimestamp: this.endGameTimestamp,
      boards: this.boards,
      winner: this.winner,
    }
  }

  startGame() {
    this.endGameTimestamp = addTimeToCurrentTimestamp(GAME_TIME)
    this.state = "active"
    Object.values(this.boards).map((board) => board.initialize())

    if (this.gameEndTimeout) {
      console.error("cleared timeout", this.gameEndTimeout)
      clearTimeout(this.gameEndTimeout)
    }
    this.gameEndTimeout = setTimeout(() => {
      this.handleGameEnd({ reason: "timeEnd" })
    }, GAME_TIME)
  }

  handleMove(move: Move, playerId: string) {
    const board = this.boards[playerId]
    board.handleMove(move)
    if (!board.nextMovePossible) {
      this.handleGameEnd({ reason: "playerBlocked", playerId })
    }
  }

  handleGameEnd(payload: handleGameEndPayload) {
    clearTimeout(this.gameEndTimeout)

    this.state = "finished"
    this.winner = this.determineWinner(payload)
  }

  private determineWinner(payload: handleGameEndPayload): string {
    switch (payload.reason) {
      case "timeEnd":
        const boardEntries = Object.entries(this.boards)
        for (let [playerId, board] of boardEntries) {
          if (!board.nextMovePossible) {
            return this.socketIds.find((x) => x !== playerId)
          }
        }

        const scores = boardEntries.map(([playerId, board]) => ({
          playerId,
          score: board.score,
        }))

        if (scores[0].score > scores[1].score) {
          return scores[0].playerId
        }
        if (scores[0].score < scores[1].score) {
          return scores[1].playerId
        }
        if (scores[0].score === scores[1].score) {
          return "draw"
        }

        console.error("this should not happen force draw")
        return "draw"
      case "playerBlocked":
        return this.socketIds.find((x) => x !== payload.playerId)
      default:
        // TODO handle this differentely
        console.error("determineWinner: reason not recognised")
        return "draw"
    }
  }
}
