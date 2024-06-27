import { useEffect, useRef, useState } from "react"
import { Board, Direction, GameStatus } from "shared-logic"
import { getStoredBoardData, getPlayerData, storePlayerData } from "../utils/localStorage"

export default function useSingleGame() {
  const [status, setStatus] = useState<GameStatus>()
  const boardRef = useRef<Board>()
  const [gameVerion, setGameVersion] = useState(0) // to trigger rerender value must change
  const [bestScore, setBestScore] = useState(0)

  const { score, tileGridStateEncoded } = boardRef.current?.data || {}
  const isResetable = gameVerion > 0

  useEffect(() => {
    boardRef.current = new Board("playerId")
    const boardStorage = getStoredBoardData()
    if (boardStorage) {
      boardRef.current.score = boardStorage.score
      boardRef.current.tileGrid = boardStorage.tileGrid
    }

    const playerDataStorage = getPlayerData()
    if (playerDataStorage) {
      setBestScore(playerDataStorage.bestScore)
    }

    setStatus("active")
    setGameVersion(0)
  }, [])

  const performMove = (direction: Direction) => {
    if (!boardRef.current) {
      return
    }
    boardRef.current.handleMove(direction)
    setGameVersion((v) => v + 1)

    // blocked - end game
    if (!boardRef.current.nextMovePossible) {
      setStatus("finished")
    }

    if (boardRef.current.score > bestScore) {
      storePlayerData({ bestScore: boardRef.current.score })
    }
  }

  const resetGame = () => {
    if (!isResetable) {
      return
    }
    boardRef.current?.reset()
    setStatus("active")
    setGameVersion(-1)
  }

  return {
    bestScore,
    status,
    score,
    tileGridStateEncoded,
    performMove,
    resetGame,
    isResetable,
  }
}
