import { processMove, deepCopyArray, Direction, TileGrid, spawnTile } from "shared-logic"

const moves: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"]

export function getRandomMove() {
  return moves[Math.floor(Math.random() * moves.length)] as Direction
}

function aiMove(board: TileGrid, searchesPerMove: number, searchLength: number) {
  const firstMoves = [...moves]
  const scores = [0, 0, 0, 0]

  for (let firstMoveIdx = 0; firstMoveIdx < 4; firstMoveIdx++) {
    const move = firstMoves[firstMoveIdx]

    const { directionValid, newTileGrid, scoreIncrease } = processMove(board, move)

    if (directionValid) {
      scores[firstMoveIdx] = scores[firstMoveIdx] + scoreIncrease
    } else {
      continue
    }

    for (let laterMoveIdx = 0; laterMoveIdx < searchesPerMove; laterMoveIdx++) {
      let moveNumber = 0
      let searchBoard = deepCopyArray(newTileGrid)
      let isValid = true

      while (isValid && moveNumber < searchLength) {
        const randomMove = getRandomMove()
        const randomMoveReult = processMove(searchBoard, randomMove)

        if (randomMoveReult.directionValid) {
          searchBoard = spawnTile(searchBoard)
          scores[firstMoveIdx] += randomMoveReult.scoreIncrease
          moveNumber++
        } else {
          isValid = false
        }
      }
    }
  }

  const bestMoveIndex = scores.indexOf(Math.max(...scores))
  const bestMove = firstMoves[bestMoveIndex]
  return bestMove
}

export default function simulate(board: TileGrid) {
  return aiMove(board, 1, 1)
}
