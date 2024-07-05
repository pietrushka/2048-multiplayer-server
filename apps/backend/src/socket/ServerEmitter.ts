import { Server } from "socket.io"
import {
  StartGamePayload,
  BoardsStateUpdatePayload,
  EndGamePayload,
  SERVER_SIGNALS,
  PrivateLobbyData,
  GameCountdownPayload,
} from "shared-logic"

export default class ServerEmitter {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  sendGameCountdown(gameId: string, payload: GameCountdownPayload) {
    this.io.to(gameId).emit(SERVER_SIGNALS.gameCountdown, payload)
  }

  sendStartGame(gameId: string, payload: StartGamePayload) {
    this.io.to(gameId).emit(SERVER_SIGNALS.startGame, payload)
  }

  sendBoardUpdate(gameId: string, payload: BoardsStateUpdatePayload) {
    this.io.to(gameId).emit(SERVER_SIGNALS.boardUpdate, payload)
  }

  sendEndGame(gameId: string, payload: EndGamePayload) {
    this.io.to(gameId).emit(SERVER_SIGNALS.endGame, payload)
  }

  sendJoinLobby(socketId: string) {
    this.io.to(socketId).emit(SERVER_SIGNALS.joinLobby)
  }

  sendJoinPrivateLobby(socketId: string, payload: PrivateLobbyData) {
    this.io.to(socketId).emit(SERVER_SIGNALS.joinPrivateLobby, payload)
  }
}
