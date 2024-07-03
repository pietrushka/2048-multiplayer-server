import crypto from "crypto"

type Room = "publicLobby" | "privateLobby" | "game"

const roomPrefix = "room"

export function generateRoomName(roomType: Room, id?: string) {
  if (roomType === "publicLobby") {
    return `${roomPrefix}_${roomType}`
  }

  const roomId = id || crypto.randomUUID()
  return `${roomPrefix}_${roomType}_${roomId}`
}
