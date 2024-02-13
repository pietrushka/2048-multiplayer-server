import { Socket } from "socket.io"

export default class User {
  socket: Socket
  nickname: string
  gameId: string

  constructor(socket: Socket) {
    this.socket = socket
  }
}
