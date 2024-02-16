import validateObject, { Schema } from "./validateObject"

// TODO move to constants
export const BOARD_STORAGE_SPACE = "2048.vs_board"
export const PLAYER_STORAGE_SPACE = "2048.vs_player"

type LocalStoragePlayer = {
  nickname: string
  bestScore: number
}

type LocalStorageBoardState = {
  score: number
  tileGrid: number[][]
}

const writeLocalStorage =
  <T extends Record<string, unknown>>(storageSpace: string) =>
  (data: T) => {
    localStorage.setItem(storageSpace, JSON.stringify(data))
  }

export const storePlayer = writeLocalStorage<LocalStoragePlayer>(PLAYER_STORAGE_SPACE)
export const storeBoardData = writeLocalStorage<LocalStorageBoardState>(BOARD_STORAGE_SPACE)

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

export const getStoredBoardData = readLocalStorage<LocalStorageBoardState>(BOARD_STORAGE_SPACE, {
  score: "number",
  tileGrid: "numberArrayArray",
})
export const getStoredPlayer = readLocalStorage<LocalStoragePlayer>(PLAYER_STORAGE_SPACE, {
  nickname: "string",
  bestScore: "number",
})
