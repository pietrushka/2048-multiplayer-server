import { Socket } from "socket.io"

export type User = {
  socket: Socket
  nickname: string
  gameId: string | null
}
