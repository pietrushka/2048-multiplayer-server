import { Board } from "../index"
import { spawnTile, initializeBoard, encodeTileGridState } from "../boardUtils"
import { TileGrid } from "../../types"
import { DIRECTIONS } from "../../constants"

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
      tileGridStateEncoded: encodeTileGridState([
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
      ]),
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
    const mockMove = DIRECTIONS.UP
    const board = new Board(mockPlayerId)

    spawnTileMock.mockImplementationOnce((tileGrid: TileGrid) => (tileGrid[3][0] = 2))

    board.handleMove(mockMove)

    expect(board.data).toEqual({
      playerId: mockPlayerId,
      tileGridStateEncoded: encodeTileGridState(
        [
          [0, 0, 0, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 0, 0, 0],
        ],
        mockMove
      ),
      score: 4,
    })
    expect(board.nextMovePossible).toBe(true)
  })
})
