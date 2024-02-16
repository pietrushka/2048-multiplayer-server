// TODO monorepo setup
// moved into React src directory as a walkaround for reacet complaining about importing from outside

export type NonEmptyTileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048

export type TileValue = NonEmptyTileValue | 0

export type TileGrid = TileValue[][]

export type BoardData = {
  playerId: string
  score: number
  tileGrid: TileGrid
}

export type GameStatus = "loading" | "active" | "finished"

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

// TODO introduce "Bomb" and "Freeze" moves
export type Move = Direction

export interface GameData {
  status: GameStatus
  endGameTimestamp?: string
  boards: BoardData[]
  winner?: string
}

// CLIENT EVENTS
export type JoinPayload = {
  nickname: string
}
export type MovePayload = {
  move: Move
}

export interface StartGamePayload extends GameData {
  state: "active"
  endGameTimestamp: string
}
export type BoardsStateUpdatePayload = GameData
export type EndGamePayload = GameData

// TYPE GUARDS
export function isStartGamePayload(payload: GameData): payload is StartGamePayload {
  return typeof payload.endGameTimestamp === "string" && payload.status === "active"
}
