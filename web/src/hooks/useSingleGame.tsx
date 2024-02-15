import { useEffect, useRef, useState } from "react"
import { Direction, GameState } from "../common/types"
import Board from "../common/Board"
import { getStoredBoardData } from "../utils/localStorage"

type UseMultiplayerProps = {
  setBestScore: (score: number) => void
  bestScore: number
}

export default function useSingleGame({ bestScore, setBestScore }: UseMultiplayerProps) {
  const [state, setState] = useState<GameState>()
  const boardRef = useRef<Board>()
  const [, setGameVersion] = useState(0) // to trigger rerender value must change

  useEffect(() => {
    boardRef.current = new Board("playerId") // TODO fix "playerId" placeholder
    const storageData = getStoredBoardData()
    if (storageData.tileGrid && storageData.score) {
      boardRef.current.score = storageData.score
      boardRef.current.tileGrid = storageData.tileGrid
    }

    setState("active")
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
      setState("finished")
    }

    if (boardRef.current.score > bestScore) {
      setBestScore(boardRef.current.score)
    }
  }

  const resetGame = () => {
    boardRef.current?.reset()
    setState("active")
    setGameVersion(0)
  }

  const { score, tileGrid } = boardRef.current?.data || {}
  return {
    state,
    score,
    tileGrid,
    performMove,
    resetGame,
  }
}
