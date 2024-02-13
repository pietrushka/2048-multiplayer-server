import { slideTiles } from "../boardUtils"

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
    expect(result).toEqual([
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
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
    expect(result).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 2, 2, 2],
    ])
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

    expect(result).toEqual([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
    ])
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

    expect(result).toEqual([
      [0, 0, 0, 2],
      [0, 0, 0, 2],
      [0, 0, 0, 2],
      [0, 0, 0, 2],
    ])
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
    expect(result).toEqual([
      [0, 4, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
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
    expect(result).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 4, 4, 4],
    ])
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
    expect(result).toEqual([
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ])
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
    expect(result).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
    ])
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
    expect(result).toEqual([
      [2, 4, 2, 0],
      [2, 4, 2, 0],
      [2, 4, 2, 0],
      [2, 4, 8, 2],
    ])
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
    expect(result).toEqual([
      [4, 4, 0, 0],
      [4, 4, 0, 0],
      [4, 4, 0, 0],
      [4, 4, 0, 0],
    ])
  })
})
