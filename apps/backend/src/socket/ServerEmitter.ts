import { Server } from "socket.io"
import { StartGamePayload, BoardsStateUpdatePayload, EndGamePayload, SERVER_SIGNALS } from "shared-logic"

export default class ServerEmitter {
  io: Server

  constructor(io: Server) {
    this.io = io
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
}
