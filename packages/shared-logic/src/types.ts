export type NonEmptyTileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048

export type TileValue = NonEmptyTileValue | 0

export type TileGrid = TileValue[][]

export type BoardData = {
  playerId: string
  score: number
  tileGridStateEncoded: string
}

export type GameStatus = "loading" | "active" | "finished" | "countdown"

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

// game engine stuff
export type Operations = "RESET"

// TODO introduce "Bomb" and "Freeze" moves
export type Move = Direction | Operations

export interface GameData {
  status: GameStatus
  endGameTimestamp?: string
  boards: BoardData[]
  winner?: string
}

// CLIENT EVENTS
export type JoinPrivateGamePayload = {
  privateLobbyId?: string
}

export type MovePayload = {
  move: Move
}

export interface StartGamePayload extends GameData {
  state: "active"
  endGameTimestamp: string
}

export type GameCountdownPayload = {
  status: "countdown"
  countdownSeconds: number
}
export type BoardsStateUpdatePayload = GameData
export type EndGamePayload = GameData

export type PrivateLobbyData = {
  privateLobbyId: string
}

// TYPE GUARDS
export function isStartGamePayload(payload: GameData): payload is StartGamePayload {
  return typeof payload.endGameTimestamp === "string" && payload.status === "active"
}
