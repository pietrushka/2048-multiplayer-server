export interface StorageBoardModel {
  score?: number
  tileGrid?: number[][]
}

export interface StoragePlayerModel {
  nickname?: string
  bestScore?: number
}

export interface Point {
  x: number
  y: number
}
