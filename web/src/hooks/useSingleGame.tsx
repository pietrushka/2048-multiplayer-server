import { useEffect, useRef, useState } from "react"
import { Direction, GameStatus } from "../common/types"
import Board from "../common/Board"
import { getStoredBoardData } from "../utils/localStorage"

type UseMultiplayerProps = {
  setBestScore: (score: number) => void
  bestScore: number
}

export default function useSingleGame({ bestScore, setBestScore }: UseMultiplayerProps) {
  const [status, setStatus] = useState<GameStatus>()
  const boardRef = useRef<Board>()
  const [, setGameVersion] = useState(0) // to trigger rerender value must change

  useEffect(() => {
    boardRef.current = new Board("playerId") // TODO fix "playerId" placeholder
    const storageData = getStoredBoardData()
    if (storageData) {
      boardRef.current.score = storageData.score
      boardRef.current.tileGrid = storageData.tileGrid
    }

    setStatus("active")
    setGameVersion((v) => v + 1)
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
      setBestScore(boardRef.current.score)
    }
  }

  const resetGame = () => {
    boardRef.current?.reset()
    setStatus("active")
    setGameVersion(0)
  }

  const { score, tileGrid } = boardRef.current?.data || {}
  return {
    status,
    score,
    tileGrid,
    performMove,
    resetGame,
  }
}
