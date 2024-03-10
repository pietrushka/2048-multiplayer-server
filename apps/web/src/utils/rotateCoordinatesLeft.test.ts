import { Direction, DIRECTIONS } from "shared-logic"
import rotateCoordinateLeft from "./rotateCoordinatesLeft"

// prettier-ignore
const input: [number, number][] = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 0], [1, 1], [1, 2], [1, 3],
  [2, 0], [2, 1], [2, 2], [2, 3],
  [3, 0], [3, 1], [3, 2], [3, 3],
]

const rotateLeft = (direction: Direction, coordinates: [number, number][]) =>
  coordinates.map((x) => rotateCoordinateLeft(x, direction, 4))
const rotateBack = (direction: Direction, coordinates: [number, number][]) =>
  coordinates.map((x) => rotateCoordinateLeft(x, direction, 4, true))

test("LEFT", () => {
  expect(rotateLeft(DIRECTIONS.LEFT, input)).toEqual(input)
  expect(rotateBack(DIRECTIONS.LEFT, input)).toEqual(input)
})

test("RIGHT", () => {
  // prettier-ignore
  const rotated: [number, number][] = [
    [3, 3], [3, 2], [3, 1], [3, 0],
    [2, 3], [2, 2], [2, 1], [2, 0],
    [1, 3], [1, 2], [1, 1], [1, 0],
    [0, 3], [0, 2], [0, 1], [0, 0],
  ]

  expect(rotateLeft(DIRECTIONS.RIGHT, input)).toEqual(rotated)
  expect(rotateBack(DIRECTIONS.RIGHT, rotated)).toEqual(input)
})

test("UP", () => {
  // prettier-ignore
  const rotated: [number, number][] = [  
    [0, 3], [1, 3], [2, 3], [3, 3],
    [0, 2], [1, 2], [2, 2], [3, 2],
    [0, 1], [1, 1], [2, 1], [3, 1],
    [0, 0], [1, 0], [2, 0], [3, 0],
]

  expect(rotateLeft(DIRECTIONS.UP, input)).toEqual(rotated)
  expect(rotateBack(DIRECTIONS.UP, rotated)).toEqual(input)
})

test("DOWN", () => {
  // prettier-ignore
  const rotated: [number, number][] = [  
    [3, 0], [2, 0], [1, 0], [0, 0],
    [3, 1], [2, 1], [1, 1], [0, 1],
    [3, 2], [2, 2], [1, 2], [0, 2],
    [3, 3], [2, 3], [1, 3], [0, 3],
  ]

  expect(rotateLeft(DIRECTIONS.DOWN, input)).toEqual(rotated)
  expect(rotateBack(DIRECTIONS.DOWN, rotated)).toEqual(input)
})
