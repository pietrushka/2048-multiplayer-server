import { Direction } from "../../../web/src/common/types"
import { deepCopyArray } from "../utils"

function createZeroMatrix(size: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

const getTileValue = () => (Math.random() > 0.1 ? 2 : 4)

export function containsEmpty(board: number[][]): boolean {
  return board.some((row) => row.some((cell) => cell === 0))
}

const getRandomCoordinate = (maxVal: number) => Math.floor(Math.random() * maxVal)

export function spawnTile(board: number[][]) {
  if (!containsEmpty(board)) {
    return board
  }

  while (true) {
    const x = getRandomCoordinate(board.length)
    const y = getRandomCoordinate(board.length)
    if (board[x][y] === 0) {
      board[x][y] = getTileValue() // TODO mutable
      break
    }
  }

  return board
}

export function initializeBoard(boardSize: number) {
  const board = createZeroMatrix(boardSize)

  spawnTile(board)
  spawnTile(board)

  return board
}

function rotateRight(matrix: number[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix[i].length; j++) {
      const temp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].reverse()
  }
}

export function rotateBoardLeft(board: number[][], direction: Direction, reverse: boolean = false): number[][] {
  if (direction === "LEFT") {
    return board
  }

  if (reverse) {
    // If reverse is true, swap the direction
    if (direction === "RIGHT") direction = "LEFT"
    else if (direction === "UP") direction = "DOWN"
    else if (direction === "DOWN") direction = "UP"
  }

  // TODO probably something not okay here with RIGHT or LEFT and reverse
  switch (direction) {
    case "RIGHT":
      rotateRight(board)
      rotateRight(board)
      break
    case "LEFT":
      rotateRight(board)
      rotateRight(board)
      break
    case "UP":
      rotateRight(board)
      rotateRight(board)
      rotateRight(board)
      break
    case "DOWN":
      rotateRight(board)
      break
  }

  return board
}

export function shiftTilesLeftInPlace(array: number[]) {
  let count = 0 // Count non-zero elements
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      array[count++] = array[i] // Move non-zero element to the next available position
    }
  }
  while (count < array.length) {
    array[count++] = 0 // Fill the rest with zeros
  }
  return array
}

export function combineToLeft(array: number[]) {
  let writePos = 0 // Track where to write the next non-zero/combined value.

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] !== 0) {
      if (array[i] === array[i + 1]) {
        array[writePos++] = array[i] * 2 // Combine and write.
        i++ // Skip the next element as it has been combined.
      } else {
        array[writePos++] = array[i] // Just write the current value.
      }
    }
  }

  // Handle the last element if it's not been part of a combination.
  if (array[array.length - 1] !== 0 && (array.length < 2 || array[array.length - 2] !== array[array.length - 1])) {
    array[writePos++] = array[array.length - 1]
  }

  // Fill the rest of the array with zeros.
  while (writePos < array.length) {
    array[writePos++] = 0
  }
  return array
}

function combineAndShiftRight(array: number[]) {
  shiftTilesLeftInPlace(array)
  combineToLeft(array)
  shiftTilesLeftInPlace(array)
}

export function slideTiles(board: number[][], direction: Direction): number[][] {
  // rotate board to "LEFT" to utilize common logic
  board = rotateBoardLeft(board, direction)

  board.forEach(combineAndShiftRight)

  // rotate back to orginal direction

  board = rotateBoardLeft(board, direction, true)

  return board
}

export function movePossible(board: number[][]): boolean {
  const boardSize = board.length

  if (containsEmpty(board)) {
    return true
  }

  // TODO optimize
  const boardMod = deepCopyArray(board).flat()
  // Check if a tile can be merged into a neighboring tile.
  for (let i = 0; i < board.length; i++) {
    if (
      boardMod[i] === boardMod[i + boardSize] ||
      boardMod[i] === boardMod[i - boardSize] ||
      (i % boardSize !== 0 && boardMod[i] === boardMod[i - 1]) ||
      (i % boardSize !== boardSize - 1 && boardMod[i] === boardMod[i + 1])
    ) {
      return true
    }
  }

  return false
}
