import { Socket } from "socket.io"

export default class User {
  socket: Socket
  nickname: string | null = null
  gameId: string | null = null

  constructor(socket: Socket) {
    this.socket = socket
  }
}
