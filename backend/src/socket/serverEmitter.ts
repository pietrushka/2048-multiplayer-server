import { Server } from "socket.io"
import { SIGNALS } from "../../../web/src/common/constants"
import {
  StartGamePayload,
  BoardsStateUpdatePayload,
  EndGamePayload,
} from "../../../web/src/common/types"

type EmitterPayload =
  | { signal: typeof SIGNALS.startGame; gameId: string; data: StartGamePayload }
  | {
      signal: typeof SIGNALS.boardUpdate
      gameId: string
      data: BoardsStateUpdatePayload
    }
  | { signal: typeof SIGNALS.endGame; gameId: string; data: EndGamePayload }

// TODO this probably could be a class or something
export default function serverEmitter(io: Server, payload: EmitterPayload) {
  console.log("serverEmitter", payload)
  switch (payload.signal) {
    case SIGNALS.startGame:
      io.to(payload.gameId).emit(SIGNALS.startGame, payload.data)
      break
    case SIGNALS.boardUpdate:
      io.to(payload.gameId).emit(SIGNALS.boardUpdate, payload.data)
      break
    case SIGNALS.endGame:
      io.to(payload.gameId).emit(SIGNALS.endGame, payload.data)
      break
    default:
      console.error("serverEmitter: signal not recognized")
  }
}
