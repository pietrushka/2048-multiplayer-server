import { Direction, Move, Operations } from "./types"

// TODO enums

export const COOKIE_NAMES = {
  PLAYER_IDENTIFIER: "playerIdentifier",
  ACCESS_TOKEN: "accessToken",
}

export const DEFAULT_BOARD_SIZE = 4

export const DRAW = "DRAW"

export const CLIENT_SIGNALS = {
  join: "join",
  joinPrivateGame: "joinPrivateGame",
  disconnect: "disconnect",
  move: "move",
  playAgain: "playAgain",
} as const

export const SERVER_SIGNALS = {
  gameCountdown: "gameCountdown",
  startGame: "startGame",
  boardUpdate: "boardUpdate",
  endGame: "endGame",
  joinLobby: "joinLobby",
  joinPrivateLobby: "joinPrivateLobby",
} as const

export const DIRECTIONS: Record<Direction, Direction> = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const

export const OPERATIONS: Record<Operations, Operations> = {
  RESET: "RESET",
} as const

export const MOVES: Record<Move, Move> = {
  ...DIRECTIONS,
  ...OPERATIONS,
} as const
