import { Socket } from "socket.io-client"
import { SIGNALS } from "../common/constants"
import { JoinPayload, MovePayload } from "../common/types"

type EmitterPayload =
  | { signal: typeof SIGNALS.join; data: JoinPayload }
  | { signal: typeof SIGNALS.move; data: MovePayload }

// TODO this probably could be a class or something
export default function emitter(
  socketIo: Socket | undefined,
  payload: EmitterPayload
) {
  if (!socketIo) {
    console.error("tried to emit without scoket io", { socketIo, payload })
    return
  }
  console.log("emitter", payload)
  switch (payload.signal) {
    case SIGNALS.join:
      socketIo.emit(SIGNALS.join, payload.data)
      break
    case SIGNALS.move:
      socketIo.emit(SIGNALS.move, payload.data)
      break
  }
}
