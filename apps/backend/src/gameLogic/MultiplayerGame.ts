import { Board, addTimeToCurrentTimestamp, GameData, DRAW, Direction } from "shared-logic"
import ServerEmitter from "../socket/ServerEmitter"
import User from "../socket/User"
import * as UserService from "../user/user.service"
import { Bot } from "../simulation/bot"

export type Player = User | Bot

const GAME_TIME = 5 * 60 * 1000 // 5min * 60s * 1000ms

const wonMatchPointsEarnings = 50

type handleGameEndPayload = { reason: "timeEnd" } | { reason: "playerBlocked"; playerId: string }

export default class MultiplayerGame {
  id: string
  status: GameData["status"]
  endGameTimestamp: GameData["endGameTimestamp"]
  boards: Board[]
  winner: GameData["winner"]
  players: Player[]
  endGameTimoutId?: NodeJS.Timeout
  serverEmitter: ServerEmitter

  constructor(serverEmitter: ServerEmitter, players: Player[]) {
    this.id = `game_${Date.now()}`
    this.status = "loading"
    this.players = players

    this.boards = [new Board(players[0].playerIdentifier), new Board(players[1].playerIdentifier)]
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
      console.error("startGame: cleared timeout", this.endGameTimoutId)
      clearTimeout(this.endGameTimoutId)
    }
    this.endGameTimoutId = setTimeout(() => {
      this.handleGameEnd({ reason: "timeEnd" })
    }, GAME_TIME)
  }

  handleMove(move: Direction, playerId: string) {
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

  async handleGameEnd(payload: handleGameEndPayload) {
    if (this.endGameTimoutId) {
      clearTimeout(this.endGameTimoutId)
      this.endGameTimoutId = undefined
    }

    this.status = "finished"
    this.winner = this.determineWinner(payload)

    this.serverEmitter.sendEndGame(this.id, this.data)

    const winner = this.players.find((x) => x.playerIdentifier === this.winner)!
    if (winner.userId) {
      await UserService.addPoints({ userId: winner.userId, earnedPoints: wonMatchPointsEarnings })
    }
  }

  private determineWinner(payload: handleGameEndPayload): string | undefined {
    switch (payload.reason) {
      case "timeEnd":
        const blockedPlayer = this.findBlockedPlayer()
        if (blockedPlayer) {
          return blockedPlayer
        }
        return this.findScoreWinner()
      case "playerBlocked":
        return this.players.find((x) => x.playerIdentifier !== payload.playerId)!.playerIdentifier
      default:
        console.error("determineWinner: reason not recognised")
        return
    }
  }
  private findBlockedPlayer() {
    if (!this.boards) {
      return
    }
    for (const board of this.boards) {
      if (!board.nextMovePossible) {
        return this.players.find((x) => x.playerIdentifier !== board.playerId)?.playerIdentifier
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
