import Board from "../Board"

describe("Board", () => {
  test("initialize", () => {
    const board = new Board("playerId")
    board.initialize()

    const flattenedBoard = board.board.flat()
    const nonZeroNumbers = flattenedBoard.filter((cell) => cell !== 0)
    expect(nonZeroNumbers.length).toBe(2)
    nonZeroNumbers.forEach((number) => {
      expect([2, 4]).toContain(number)
    })
  })

  test("handleMove", () => {
    const board = new Board("playerId")
    board.initialize()
    board.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 2, 2],
    ]
    board.handleMove("UP")
    expect(board.board).toEqual([
      [0, 0, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
  })
})
