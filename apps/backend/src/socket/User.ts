import { Socket } from "socket.io"

export default class User {
  userId: string
  socket: Socket
  nickname: string | null = null
  gameId: string | null = null

  constructor(socket: Socket, userId: string) {
    this.socket = socket
    this.userId = userId
  }
}
