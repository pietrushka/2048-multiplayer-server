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

    if (!directionValid) {
      scores[firstMoveIdx] = Number.NEGATIVE_INFINITY // Penalize invalid moves
      continue
    }

    scores[firstMoveIdx] = scores[firstMoveIdx] + scoreIncrease

    for (let laterMoveIdx = 0; laterMoveIdx < searchesPerMove; laterMoveIdx++) {
      let moveNumber = 0
      const searchBoard = deepCopyArray(newTileGrid)
      // not spawning tile in processMove for better randomness
      const canSpawn = spawnTile(searchBoard)
      let isValid = canSpawn

      while (isValid && moveNumber < searchLength) {
        const randomMove = getRandomMove()
        const randomMoveReult = processMove(searchBoard, randomMove)

        if (randomMoveReult.directionValid) {
          const canSpawn = spawnTile(searchBoard)
          isValid = canSpawn
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
  return aiMove(board, 20, 10)
}
