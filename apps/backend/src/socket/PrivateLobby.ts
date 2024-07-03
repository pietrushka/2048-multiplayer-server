import { generateRoomName } from "../gameLogic/roomUtils"
import User from "./User"

type PrivateLobbyProps = {
  host: User
}

export default class PrivateLobby {
  id: string
  host: User
  players: User[] = []

  constructor({ host }: PrivateLobbyProps) {
    this.host = host
    this.id = generateRoomName("privateLobby", host.playerIdentifier)

    host.socket.join(this.id)
    this.players.push(host)
  }

  join(user: User) {
    user.socket.join(this.id)
    this.players.push(user)
  }
}
