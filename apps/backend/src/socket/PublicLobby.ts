import { generateRoomName } from "../gameLogic/roomUtils"
import User from "./User"

const LOBBY_ROOM = generateRoomName("publicLobby")

export default class PublicLobby {
  users: Set<User> = new Set()

  get size() {
    return this.users.size
  }

  get userArray() {
    return Array.from(this.users)
  }

  join(user: User) {
    user.socket.join(LOBBY_ROOM)
    this.users.add(user)
  }

  throwUserOut(user: User) {
    user.socket.leave(LOBBY_ROOM)
    this.users.delete(user)
  }

  clear() {
    for (const user of this.users) {
      this.throwUserOut(user)
    }
  }
}
