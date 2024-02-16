import { Socket } from "socket.io-client"
import { CLIENT_SIGNALS } from "../common/constants"
import { JoinPayload, MovePayload } from "../common/types"

type EmitterPayload =
  | { signal: typeof CLIENT_SIGNALS.join; data: JoinPayload }
  | { signal: typeof CLIENT_SIGNALS.move; data: MovePayload }

// TODO this probably could be a class or something
export default function emitter(socketIo: Socket | undefined, payload: EmitterPayload) {
  if (!socketIo) {
    console.error("tried to emit without scoket io", { socketIo, payload })
    return
  }
  switch (payload.signal) {
    case CLIENT_SIGNALS.join:
      socketIo.emit(CLIENT_SIGNALS.join, payload.data)
      break
    case CLIENT_SIGNALS.move:
      socketIo.emit(CLIENT_SIGNALS.move, payload.data)
      break
  }
}
