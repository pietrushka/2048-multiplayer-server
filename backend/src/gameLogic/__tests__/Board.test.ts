import Board from "../Board"
import { spawnTile, initializeBoard } from "../boardUtils"

// mocking predict where new tiles will spawn
jest.mock("../boardUtils", () => ({
  ...jest.requireActual("../boardUtils"),
  initializeBoard: jest.fn(),
  spawnTile: jest.fn(),
}))
const spawnTileMock = spawnTile as jest.Mock
const initializeBoardMock = initializeBoard as jest.Mock

const mockPlayerId = "mockPlayerId"

describe("Board", () => {
  test("constructor", () => {
    initializeBoardMock.mockImplementationOnce(() => [
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ])

    const board = new Board(mockPlayerId)

    expect(board.data).toEqual({
      playerId: mockPlayerId,
      tileGrid: [
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
      ],
      score: 0,
    })
    expect(board.nextMovePossible).toBe(true)
  })

  test("handleMove", () => {
    initializeBoardMock.mockImplementationOnce(() => [
      [0, 0, 0, 0],
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 2],
    ])
    const board = new Board(mockPlayerId)

    spawnTileMock.mockImplementationOnce((tileGrid: number[][]) => (tileGrid[3][0] = 2))

    board.handleMove("UP")

    expect(board.data).toEqual({
      playerId: mockPlayerId,
      tileGrid: [
        [0, 0, 0, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
      ],
      score: 4,
    })
    expect(board.nextMovePossible).toBe(true)
  })
})
