import { Server } from "socket.io"
import { SIGNALS } from "../../../web/src/common/constants"
import { StartGamePayload, BoardsStateUpdatePayload, EndGamePayload } from "../../../web/src/common/types"

export default class ServerEmitter {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  sendStartGame(gameId: string, payload: StartGamePayload) {
    this.io.to(gameId).emit(SIGNALS.startGame, payload)
  }

  sendBoardUpdate(gameId: string, payload: BoardsStateUpdatePayload) {
    this.io.to(gameId).emit(SIGNALS.boardUpdate, payload)
  }

  sendEndGame(gameId: string, payload: EndGamePayload) {
    this.io.to(gameId).emit(SIGNALS.endGame, payload)
  }
}
