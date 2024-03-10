import { Direction, DIRECTIONS } from "shared-logic"

export default function rotateCoordinateLeft(
  [x, y]: number[],
  direction: Direction,
  matrixSize: number,
  reverse: boolean = false
): number[] {
  if (direction === DIRECTIONS.LEFT) {
    return [x, y]
  }

  let rotationMod = direction
  if (reverse) {
    // If reverse is true, swap the direction
    if (direction === DIRECTIONS.RIGHT) rotationMod = DIRECTIONS.LEFT
    else if (direction === DIRECTIONS.UP) rotationMod = DIRECTIONS.DOWN
    else if (direction === DIRECTIONS.DOWN) rotationMod = DIRECTIONS.UP
  }

  let newX = x
  let newY = y

  switch (rotationMod) {
    // 180 deg
    case DIRECTIONS.LEFT:
    case DIRECTIONS.RIGHT:
      newX = matrixSize - 1 - x
      newY = matrixSize - 1 - y
      break
    case DIRECTIONS.UP:
      // 90 deg counterclockwise
      newX = y
      newY = matrixSize - 1 - x
      break
    case DIRECTIONS.DOWN:
      // 90 deg clockwise
      newX = matrixSize - 1 - y
      newY = x
      break
  }

  return [newX, newY]
}
