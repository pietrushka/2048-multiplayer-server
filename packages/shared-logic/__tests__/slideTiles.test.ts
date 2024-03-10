import { slideTiles } from "../src/Board/boardUtils"

// Although the board is always rotated left to slide tiles,
// testing different directions can help catch some bugs.

describe("slideTiles", () => {
  test("plain UP", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 2, 2, 2],
      ],
      "UP"
    )
    expect(result.tileGrid).toEqual([
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(result.scoreIncrease).toBe(0)
  })

  test("plain DOWN", () => {
    const result = slideTiles(
      [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "DOWN"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 2, 2, 2],
    ])
    expect(result.scoreIncrease).toBe(0)
  })

  test("plain LEFT", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2],
      ],
      "LEFT"
    )

    expect(result.tileGrid).toEqual([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
    ])
    expect(result.scoreIncrease).toBe(0)
  })

  test("plain RIGHT", () => {
    const result = slideTiles(
      [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
      ],
      "RIGHT"
    )

    expect(result.tileGrid).toEqual([
      [0, 0, 0, 2],
      [0, 0, 0, 2],
      [0, 0, 0, 2],
      [0, 0, 0, 2],
    ])
    expect(result.scoreIncrease).toBe(0)
  })

  test("merge UP", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [0, 2, 2, 2],
      ],
      "UP"
    )
    expect(result.tileGrid).toEqual([
      [0, 4, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(result.scoreIncrease).toBe(12)
  })

  test("merge DOWN", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [0, 2, 2, 2],
      ],
      "DOWN"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 4, 4, 4],
    ])
    expect(result.scoreIncrease).toBe(12)
  })

  test("merge LEFT", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 0],
        [0, 0, 2, 2],
        [0, 2, 0, 2],
        [0, 2, 2, 0],
      ],
      "LEFT"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ])
    expect(result.scoreIncrease).toBe(12)
  })

  test("merge RIGHT", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 0],
        [0, 0, 2, 2],
        [0, 2, 0, 2],
        [0, 2, 2, 0],
      ],
      "RIGHT"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
    ])
    expect(result.scoreIncrease).toBe(12)
  })

  test("blocked merge", () => {
    const result = slideTiles(
      [
        [2, 4, 0, 2],
        [2, 0, 4, 2],
        [2, 4, 2, 0],
        [2, 4, 8, 2],
      ],
      "LEFT"
    )
    expect(result.tileGrid).toEqual([
      [2, 4, 2, 0],
      [2, 4, 2, 0],
      [2, 4, 2, 0],
      [2, 4, 8, 2],
    ])
    expect(result.scoreIncrease).toBe(0)
  })

  test("no double merge", () => {
    const result = slideTiles(
      [
        [4, 2, 0, 2],
        [2, 2, 4, 0],
        [2, 2, 2, 2],
        [0, 4, 2, 2],
      ],
      "LEFT"
    )
    expect(result.tileGrid).toEqual([
      [4, 4, 0, 0],
      [4, 4, 0, 0],
      [4, 4, 0, 0],
      [4, 4, 0, 0],
    ])
    expect(result.scoreIncrease).toBe(20)
  })

  test("no ghost tiles", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 0],
        [0, 0, 0, 4],
        [0, 4, 2, 4],
        [32, 32, 8, 32],
      ],
      "RIGHT"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 4],
      [0, 4, 2, 4],
      [0, 64, 8, 32], // there was 32, 64, 8, 32
    ])

    expect(result.scoreIncrease).toBe(64)
  })

  test("unnamed case 1", () => {
    const result = slideTiles(
      [
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 4, 2],
        [16, 128, 4, 2],
      ],
      "UP"
    )
    expect(result.tileGrid).toEqual([
      [16, 128, 8, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])

    expect(result.scoreIncrease).toBe(16)
  })

  test("unnamed case 2", () => {
    const result = slideTiles(
      [
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [8, 0, 2, 0],
        [2, 4, 16, 0],
      ],
      "DOWN"
    )
    expect(result.tileGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [8, 2, 2, 0],
      [2, 4, 16, 0],
    ])

    expect(result.scoreIncrease).toBe(0)
  })
})
