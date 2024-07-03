import { Socket } from "socket.io"

export default class User {
  playerIdentifier: string
  userId: string | undefined
  socket: Socket
  nickname: string | null = null
  gameId: string | null = null

  constructor({ socket, userId, playerIdentifier }: { socket: Socket; userId?: string; playerIdentifier: string }) {
    this.socket = socket
    this.playerIdentifier = playerIdentifier
    this.userId = userId
  }

  get data() {
    return {
      playerIdentifier: this.playerIdentifier,
      socketId: this.socket.id,
      userId: this.userId,
      nickname: this.nickname,
      gameId: this.gameId,
    }
  }
}
