import { TileGrid, Direction, Move } from "../types"
import { deepCopyArray } from "../utils"

function createZeroMatrix(size: number): TileGrid {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

const getTileValue = () => (Math.random() > 0.1 ? 2 : 4)

export function containsEmpty(board: TileGrid): boolean {
  return board.some((row) => row.some((cell) => cell === 0))
}

// mutates tileGrid => returns boolean representing if tile was spawned
export function spawnTile(tileGrid: TileGrid) {
  const emptyCoordinates = tileGrid.flatMap((row, y) => {
    return row.flatMap((cell, x) => (cell === 0 ? [{ x, y }] : []))
  })

  if (!emptyCoordinates.length) {
    return false
  }

  const coordinates = emptyCoordinates[Math.floor(Math.random() * emptyCoordinates.length)]
  tileGrid[coordinates.y][coordinates.x] = getTileValue()

  return true
}

export function initializeBoard(boardSize: number) {
  const board = createZeroMatrix(boardSize)

  spawnTile(board)
  spawnTile(board)

  return board
}

// mutable
export function rotateRight(matrix: unknown[][]) {
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

export function rotateBoardToLeft<T>(board: T[][], direction: Direction, reverse: boolean = false) {
  if (direction === "LEFT") {
    return board
  }

  if (reverse) {
    // If reverse is true, swap the direction
    if (direction === "RIGHT") direction = "LEFT"
    else if (direction === "UP") direction = "DOWN"
    else if (direction === "DOWN") direction = "UP"
  }

  switch (direction) {
    case "RIGHT":
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

export function combineToLeft(row: number[]) {
  let scoreIncrease = 0 // it is much easier to calculate this during the combination

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0) {
      const areTileValuesTheSame = row[i] === row[i + 1]
      if (areTileValuesTheSame) {
        const combinedValue = row[i] * 2
        row[i] = combinedValue // write combined value
        row[i + 1] = 0
        i++ // next one will be "0" so skipping
        scoreIncrease += combinedValue
      }
    }
  }

  return { row, scoreIncrease }
}

function combineAndShiftLeft(array: number[]) {
  shiftTilesLeftInPlace(array)
  const scoreIncrease = combineToLeft(array)
  shiftTilesLeftInPlace(array)
  return scoreIncrease
}

// mutates tileGrid for performance reasons
export function slideTiles(tileGrid: TileGrid, direction: Direction) {
  let scoreIncrease = 0
  // rotate board to "LEFT" to utilize common logic
  tileGrid = rotateBoardToLeft(tileGrid, direction)

  for (const row of tileGrid) {
    const { scoreIncrease: rowScoreIncrease } = combineAndShiftLeft(row)
    scoreIncrease += rowScoreIncrease
  }

  // rotate back to orginal direction
  tileGrid = rotateBoardToLeft(tileGrid, direction, true)

  return { tileGrid, scoreIncrease }
}

function checkHorizontalMergePossible(board: TileGrid) {
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    const row = board[rowIndex]
    // check if tile on right can be merged
    for (let tileIndex = 0; tileIndex < row.length - 1; tileIndex++) {
      if (row[tileIndex] === row[tileIndex + 1]) {
        return true
      }
    }
  }
  return false
}

export function movePossible(board: TileGrid): boolean {
  if (containsEmpty(board)) {
    return true
  }

  // horizontal
  if (checkHorizontalMergePossible(board)) {
    return true
  }

  // vertical
  const boardCopy = deepCopyArray(board)
  rotateRight(boardCopy)
  if (checkHorizontalMergePossible(boardCopy)) {
    return true
  }

  return false
}

export function encodeTileGridState(tileGrid: TileGrid, previousMove?: Move) {
  return JSON.stringify({ tileGrid, previousMove })
}

export function decodeTileGridState(tileGridStateString: string): { tileGrid: TileGrid; previousMove?: Move } {
  return JSON.parse(tileGridStateString)
}
