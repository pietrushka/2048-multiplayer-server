// TODO monorepo setup
// moved into React src directory as a walkaround for reacet complaining about importing from outside

export type BoardState = {
  score: number | null
  board: number[][] | null
}

export type GameState = "loading" | "active" | "finished"

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

// TODO introduce "Bomb" and "Freeze" moves
export type Move = Direction

type Boards = Record<string, BoardState>

export type GameData = {
  state: GameState
  gameEndTimestamp: string
  boards: Boards
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
export type StartGamePayload = GameData
export type BoardsStateUpdatePayload = GameData
export type EndGamePayload = GameData
