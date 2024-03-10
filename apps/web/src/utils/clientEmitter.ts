import { Socket } from "socket.io-client"
import { CLIENT_SIGNALS, JoinPayload, MovePayload } from "shared-logic"

type EmitterPayload =
  | { signal: typeof CLIENT_SIGNALS.join; data: JoinPayload }
  | { signal: typeof CLIENT_SIGNALS.move; data: MovePayload }
  | { signal: typeof CLIENT_SIGNALS.playAgain }

function assertNever(x: never): void {
  throw new Error("Unexpected object: " + x)
}

export default function emitter(socketIo: Socket | undefined, payload: EmitterPayload) {
  if (!socketIo) {
    console.error("tried to emit without socket io", { socketIo, payload })
    return
  }
  switch (payload.signal) {
    case CLIENT_SIGNALS.join:
      socketIo.emit(CLIENT_SIGNALS.join, payload.data)
      break
    case CLIENT_SIGNALS.move:
      socketIo.emit(CLIENT_SIGNALS.move, payload.data)
      break
    case CLIENT_SIGNALS.playAgain:
      socketIo.emit(CLIENT_SIGNALS.playAgain)
      break
    default:
      // Ensures TypeScript checks that every signal type in EmitterPayload has its handlar
      assertNever(payload)
  }
}
