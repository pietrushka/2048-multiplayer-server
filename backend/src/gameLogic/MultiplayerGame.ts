import Board from "../../../web/src/common/Board"
import { addTimeToCurrentTimestamp } from "../../../web/src/common/utils"
import { Move, GameData } from "../../../web/src/common/types"
import { DRAW, GAME_TIME } from "../../../web/src/common/constants"
import ServerEmitter from "../socket/ServerEmitter"

type handleGameEndPayload = { reason: "timeEnd" } | { reason: "playerBlocked"; playerId: string }

export default class MultiplayerGame {
  id: string
  status: GameData["status"]
  endGameTimestamp: GameData["endGameTimestamp"]
  boards: Board[]
  winner: GameData["winner"]
  socketIds: string[]
  private endGameTimoutId?: NodeJS.Timeout
  serverEmitter: ServerEmitter

  constructor(serverEmitter: ServerEmitter, socketIds: string[]) {
    this.id = `game_${Date.now()}`
    this.status = "loading"
    this.socketIds = socketIds
    this.boards = [new Board(socketIds[0]), new Board(socketIds[1])]
    this.winner
    this.endGameTimestamp
    this.endGameTimoutId
    this.serverEmitter = serverEmitter
  }

  get data(): GameData {
    return {
      status: this.status,
      endGameTimestamp: this.endGameTimestamp,
      boards: this.boards.map((board) => board.data),
      winner: this.winner,
    }
  }

  startGame() {
    this.endGameTimestamp = addTimeToCurrentTimestamp(GAME_TIME)
    this.status = "active"

    if (this.endGameTimoutId) {
      console.error("cleared timeout", this.endGameTimoutId)
      clearTimeout(this.endGameTimoutId)
    }
    this.endGameTimoutId = setTimeout(() => {
      this.handleGameEnd({ reason: "timeEnd" })
    }, GAME_TIME)
  }

  handleMove(move: Move, playerId: string) {
    const board = this.boards?.find((board) => board.playerId === playerId)

    if (!board) {
      console.error("handleMove: no board", { board, playerId })
      return
    }

    board.handleMove(move)
    if (!board.nextMovePossible) {
      this.handleGameEnd({ reason: "playerBlocked", playerId })
    }
  }

  handleGameEnd(payload: handleGameEndPayload) {
    if (this.endGameTimoutId) {
      clearTimeout(this.endGameTimoutId)
    }

    this.status = "finished"
    this.winner = this.determineWinner(payload)

    this.serverEmitter.sendEndGame(this.id, this.data)
  }

  private determineWinner(payload: handleGameEndPayload): string {
    switch (payload.reason) {
      case "timeEnd":
        const blockedPlayer = this.findBlockedPlayer()
        if (blockedPlayer) {
          return blockedPlayer
        }
        return this.findScoreWinner()
      case "playerBlocked":
        return this.socketIds.find((x) => x !== payload.playerId)!
      default:
        console.error("determineWinner: reason not recognised")
        return DRAW
    }
  }
  private findBlockedPlayer() {
    if (!this.boards) {
      return
    }
    for (const board of this.boards) {
      if (!board.nextMovePossible) {
        return this.socketIds.find((x) => x !== board.playerId)!
      }
    }
  }

  private findScoreWinner() {
    if (!this.boards) {
      console.error("findScoreWinner: no boards")
      return DRAW
    }

    if (this.boards[0].score > this.boards[1].score) {
      return this.boards[0].playerId
    }
    if (this.boards[0].score < this.boards[1].score) {
      return this.boards[1].playerId
    }

    return DRAW
  }
}
