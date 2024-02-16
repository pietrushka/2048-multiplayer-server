import { Server } from "socket.io"
import MultiplayerGame from "./MultiplayerGame"
import ServerEmitter from "../socket/ServerEmitter"
import Board from "../../../web/src/common/Board"

jest.mock("../socket/ServerEmitter", () => {
  return jest.fn().mockImplementation(() => ({
    sendStartGame: jest.fn(),
    sendBoardUpdate: jest.fn(),
    sendEndGame: jest.fn(),
  }))
})

describe("MultiplayerGame", () => {
  const mockIo = {} as Server
  const mockServerEmitter = new ServerEmitter(mockIo)
  const mockSocketIds = ["mockSocket1", "mockSocket2"]

  test("initializes with correct default values", () => {
    const game = new MultiplayerGame(mockServerEmitter, mockSocketIds)

    expect(game.id.startsWith("game_")).toBe(true)
    expect(game.status).toBe("loading")
    expect(game.socketIds).toEqual(mockSocketIds)
    expect(game.boards.length).toBe(2)
    expect(game.boards[0].playerId).toBe(mockSocketIds[0])
    expect(game.boards[1].playerId).toBe(mockSocketIds[1])
  })

  test("game start", () => {
    const game = new MultiplayerGame(mockServerEmitter, mockSocketIds)
    game.startGame()

    expect(game.status).toBe("active")
    expect(game.endGameTimestamp).toEqual(expect.any(String))
    expect(typeof game.endGameTimoutId).toBe("object")

    clearTimeout(game.endGameTimoutId)
  })
  test("correctly handles a valid move", () => {
    const handleMoveSpy = jest.spyOn(Board.prototype, "handleMove")
    const game = new MultiplayerGame(mockServerEmitter, mockSocketIds)
    game.startGame()
    game.handleMove("LEFT", mockSocketIds[0])
    expect(handleMoveSpy).toHaveBeenCalled()

    clearTimeout(game.endGameTimoutId)
  })

  test("ends the game if a move blocks the player", () => {
    const game = new MultiplayerGame(mockServerEmitter, mockSocketIds)
    const handleGameEndSpy = jest.spyOn(game, "handleGameEnd")
    const sendEndGameSpy = jest.spyOn(mockServerEmitter, "sendEndGame")
    game.startGame()
    game.boards[0].tileGrid = [
      [2, 16, 4, 2],
      [8, 4, 2, 4],
      [32, 2, 4, 2],
      [64, 0, 2, 4],
    ]
    game.handleMove("RIGHT", mockSocketIds[0])

    expect(game.boards[0].nextMovePossible).toBe(false)
    expect(handleGameEndSpy).toHaveBeenCalledWith({ reason: "playerBlocked", playerId: mockSocketIds[0] })
    expect(sendEndGameSpy).toHaveBeenCalled()
    expect(game.status).toBe("finished")
    expect(game.winner).toBe(mockSocketIds[1])

    clearTimeout(game.endGameTimoutId)
  })

  test("ends the game when time runs out", () => {
    jest.useFakeTimers()
    const game = new MultiplayerGame(mockServerEmitter, mockSocketIds)
    const handleGameEndSpy = jest.spyOn(game, "handleGameEnd")
    game.startGame()
    game.boards[0].score = 50
    game.boards[1].score = 51

    jest.runAllTimers()

    expect(game.status).toBe("finished")
    expect(game.winner).toBe(mockSocketIds[1])
    expect(handleGameEndSpy).toHaveBeenCalledWith({ reason: "timeEnd" })
    expect(typeof game.endGameTimoutId).toBe("undefined")

    clearTimeout(game.endGameTimoutId)
  })
})
