import { combineToLeft, containsEmpty, rotateBoardLeft, shiftTilesLeftInPlace, movePossible } from "../boardUtils"
import { deepCopyArray } from "../../utils"

describe("boardUtils", () => {
  test("containsEmpty", () => {
    expect(
      containsEmpty([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
    ).toBe(true)
    expect(
      containsEmpty([
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
      ])
    ).toBe(false)
    expect(
      containsEmpty([
        [2, 2, 2, 2],
        [2, 0, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
      ])
    ).toBe(true)
  })
  test("rotateBoardLeft", () => {
    const input = [
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
    ]

    // UP
    const resultUp = rotateBoardLeft(deepCopyArray(input), "UP")
    const expectedUP = [
      [12, 13, 14, 15],
      [8, 9, 10, 11],
      [4, 5, 6, 7],
      [0, 1, 2, 3],
    ]
    expect(resultUp).toEqual(expectedUP)
    const resultReverseUP = rotateBoardLeft(resultUp, "UP", true)
    expect(resultReverseUP).toEqual(input)

    // DOWN
    const resultDown = rotateBoardLeft(deepCopyArray(input), "DOWN")
    const expectedDown = [
      [3, 2, 1, 0],
      [7, 6, 5, 4],
      [11, 10, 9, 8],
      [15, 14, 13, 12],
    ]
    expect(resultDown).toEqual(expectedDown)
    const resultReverseDown = rotateBoardLeft(resultDown, "DOWN", true)
    expect(resultReverseDown).toEqual(input)

    // RIGHT
    const resultRight = rotateBoardLeft(deepCopyArray(input), "RIGHT")
    const expectedRight = [
      [15, 11, 7, 3],
      [14, 10, 6, 2],
      [13, 9, 5, 1],
      [12, 8, 4, 0],
    ]
    expect(resultRight).toEqual(expectedRight)
    const resultReverseRight = rotateBoardLeft(resultRight, "RIGHT", true)
    expect(resultReverseRight).toEqual(input)

    // LEFT - no change
    const resultLeft = rotateBoardLeft(deepCopyArray(input), "LEFT")
    expect(resultLeft).toEqual(input)
    const resultReverseLeft = rotateBoardLeft(resultLeft, "LEFT", true)
    expect(resultReverseLeft).toEqual(input)
  })
  test("shiftTilesLeftInPlace", () => {
    expect(shiftTilesLeftInPlace([0, 0, 2, 2])).toEqual([2, 2, 0, 0])
    expect(shiftTilesLeftInPlace([0, 2, 0, 2])).toEqual([2, 2, 0, 0])
    expect(shiftTilesLeftInPlace([2, 0, 2, 0])).toEqual([2, 2, 0, 0])
    expect(shiftTilesLeftInPlace([2, 2, 0, 0])).toEqual([2, 2, 0, 0])
  })
  test("combineToLeft", () => {
    const result1 = combineToLeft([2, 2, 2, 2])
    expect(result1.row).toEqual([4, 0, 4, 0])
    expect(result1.scoreIncrease).toBe(8)
    const result2 = combineToLeft([2, 2, 2, 0])
    expect(result2.row).toEqual([4, 0, 2, 0])
    expect(result2.scoreIncrease).toBe(4)
    const result3 = combineToLeft([2, 2, 0, 0])
    expect(result3.row).toEqual([4, 0, 0, 0])
    expect(result3.scoreIncrease).toBe(4)
    const result4 = combineToLeft([2, 0, 0, 0])
    expect(result4.row).toEqual([2, 0, 0, 0])
    expect(result4.scoreIncrease).toBe(0)
    const result5 = combineToLeft([32, 8, 32, 32])
    expect(result5.row).toEqual([32, 8, 64, 0])
    expect(result5.scoreIncrease).toBe(64)
    const result6 = combineToLeft([8, 4, 2, 8])
    expect(result6.row).toEqual([8, 4, 2, 8])
    expect(result6.scoreIncrease).toBe(0)
  })
  test("movePossible", () => {
    expect(
      movePossible([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
      ])
    ).toBe(true)
    expect(
      movePossible([
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
      ])
    ).toBe(true)
    expect(
      movePossible([
        [2, 4, 8, 4],
        [4, 16, 4, 8],
        [8, 32, 16, 32],
        [16, 2, 128, 512],
      ])
    ).toBe(false)
  })
})
