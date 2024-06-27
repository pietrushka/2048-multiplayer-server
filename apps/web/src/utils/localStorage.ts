import validateObject, { Schema } from "./validateObject"
import { TileGrid } from "shared-logic"

enum StorageSpace {
  PlayerData = "2048.vs_player_data",
  Board = "2048.vs_board",
}

type LocalStoragePlayer = {
  bestScore: number
}

export type LocalStorageBoardState = {
  score: number
  tileGrid: TileGrid
}

const writeLocalStorage =
  <T extends Record<string, unknown>>(storageSpace: string) =>
  (data: T) => {
    localStorage.setItem(storageSpace, JSON.stringify(data))
  }

const readLocalStorage =
  <T extends Record<string, unknown>>(storageSpace: string, schema: Schema) =>
  (): T | undefined => {
    const itemString = localStorage.getItem(storageSpace)

    if (!itemString) {
      return
    }

    const item: unknown = JSON.parse(itemString)
    const isValid = validateObject(schema, item)

    if (!isValid) {
      return
    }

    return item as T
  }

export const storePlayerData = writeLocalStorage<LocalStoragePlayer>(StorageSpace.PlayerData)
export const storeBoardData = writeLocalStorage<LocalStorageBoardState>(StorageSpace.Board)

export const getStoredBoardData = readLocalStorage<LocalStorageBoardState>(StorageSpace.Board, {
  score: "number",
  tileGrid: "numberArrayArray",
})
export const getPlayerData = readLocalStorage<LocalStoragePlayer>(StorageSpace.PlayerData, {
  bestScore: "number",
})

export const removeBoardData = () => {
  localStorage.removeItem(StorageSpace.Board)
}
