// TODO monorepo setup
// moved into React src directory as a walkaround for reacet complaining about importing from outside

export type BoardData = {
  playerId: string
  score: number
  tileGrid: number[][]
}

export type GameState = "loading" | "active" | "finished"

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

// TODO introduce "Bomb" and "Freeze" moves
export type Move = Direction

export interface GameData {
  state: GameState
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

// SERVER EVENTS
export interface StartGamePayload extends GameData {
  state: "active"
  endGameTimestamp: string
}
export type BoardsStateUpdatePayload = GameData
export type EndGamePayload = GameData

// TYPE GUARDS
export function isStartGamePayload(payload: GameData): payload is StartGamePayload {
  return typeof payload.endGameTimestamp === "string" && payload.state === "active"
}
