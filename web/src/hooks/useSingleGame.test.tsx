import { renderHook, act } from "@testing-library/react"
import useSingleGame from "./useSingleGame"
import { getStoredBoardData } from "../utils/localStorage"
import { initializeBoard, spawnTile } from "../common/Board/boardUtils"
import Board from "../common/Board"

jest.mock("../utils/localStorage", () => ({
  getStoredBoardData: jest.fn(),
}))
const getStoredBoardDataMock = getStoredBoardData as jest.Mock

jest.mock("../common/Board/boardUtils", () => {
  const actualBoardUtils = jest.requireActual("../common/Board/boardUtils")
  return {
    ...actualBoardUtils,
    initializeBoard: jest.fn(),
    spawnTile: jest.fn(),
  }
})
const initializeBoardMock = initializeBoard as jest.Mock
const spawnTileMock = spawnTile as jest.Mock

describe("useSingleGame hook", () => {
  let setBestScoreMock = jest.fn()

  // TODO mocking in beforeEach looks like walkaround, probably should handle default mock in jest.mock
  // but wasn't able to successfully use actualBoardUtils in it
  beforeEach(() => {
    const actualBoardUtils = jest.requireActual("../common/Board/boardUtils")
    initializeBoardMock.mockImplementation(actualBoardUtils.initializeBoard)
    spawnTileMock.mockImplementation(actualBoardUtils.spawnTile)

    getStoredBoardDataMock.mockReturnValue({})
  })

  test("initializes", () => {
    const mockTileGrid = [
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ]
    initializeBoardMock.mockImplementationOnce(() => mockTileGrid)

    const { result } = renderHook(() => useSingleGame({ bestScore: 0, setBestScore: setBestScoreMock }))

    expect(result.current.state).toEqual("active")
    expect(result.current.score).toEqual(0)
    expect(result.current.tileGrid).toEqual(mockTileGrid)
  })

  test("initializes with stored data if available", () => {
    const mockStorageData = {
      tileGrid: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 2, 2, 128],
        [2048, 1024, 512, 256],
      ],
      score: 10204,
    }
    getStoredBoardDataMock.mockReturnValueOnce(mockStorageData)

    const { result } = renderHook(() => useSingleGame({ bestScore: 0, setBestScore: setBestScoreMock }))

    expect(result.current.state).toEqual("active")
    expect(result.current.score).toEqual(mockStorageData.score)
    expect(result.current.tileGrid).toEqual(mockStorageData.tileGrid)
  })

  test("performMove", () => {
    const mockTileGrid = [
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 2, 4],
    ]
    initializeBoardMock.mockReturnValueOnce(mockTileGrid)

    spawnTileMock.mockImplementationOnce((tileGrid: number[][]) => {
      tileGrid[0][0] = 2
      return tileGrid
    })
    const initialBestScore = 15
    const newScore = 16

    const { result } = renderHook(() => useSingleGame({ bestScore: initialBestScore, setBestScore: setBestScoreMock }))

    act(() => {
      result.current.performMove("UP")
    })

    expect(result.current.tileGrid).toEqual([
      [2, 0, 2, 8],
      [0, 0, 0, 8],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(result.current.score).toEqual(newScore)
    expect(setBestScoreMock).toHaveBeenCalledWith(newScore)
  })

  test("finishes the game when no next moves are possible + resets it corretly", () => {
    const resetSpy = jest.spyOn(Board.prototype, "reset")

    const mockTileGrid = [
      [0, 16, 4, 2],
      [8, 4, 2, 4],
      [32, 2, 4, 2],
      [64, 5, 2, 4],
    ]
    initializeBoardMock.mockReturnValueOnce(mockTileGrid)

    const { result } = renderHook(() => useSingleGame({ bestScore: 0, setBestScore: setBestScoreMock }))

    // FINISH GAME FLOW
    act(() => {
      result.current.performMove("UP")
    })
    expect(result.current.state).toEqual("finished")

    // // RESET GAME FLOW
    act(() => {
      result.current.resetGame()
    })
    expect(result.current.state).toEqual("active")
    expect(result.current.score).toBe(0)
    expect(resetSpy).toHaveBeenCalled()
  })
})
