import { storePlayer, getStoredPlayer, PLAYER_STORAGE_SPACE } from "./localStorage"

const playerMock = {
  nickname: "playerName",
  bestScore: 22,
}

// board local storage handling shares most of the logic with player handling
describe("player", () => {
  afterEach(() => {
    localStorage.clear()
  })

  test("stores player", () => {
    storePlayer(playerMock)

    const result = JSON.parse(localStorage.getItem(PLAYER_STORAGE_SPACE)!)
    expect(result).toEqual(playerMock)
  })

  test("reads player", () => {
    localStorage.setItem(PLAYER_STORAGE_SPACE, JSON.stringify(playerMock))
    expect(getStoredPlayer()).toEqual(playerMock)
  })

  test("discards invalid player data", () => {
    const notValidDataEntry = JSON.stringify({
      nickname: "wrong",
    })
    localStorage.setItem(PLAYER_STORAGE_SPACE, notValidDataEntry)
    expect(getStoredPlayer()).toBe(undefined)
  })
})
