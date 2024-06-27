import { useEffect, useRef, useState } from "react"
import { Board, Direction, GameStatus } from "shared-logic"
import {
  getStoredBoardData,
  getPlayerData,
  storePlayerData,
  storeBoardData,
  removeBoardData,
  LocalStorageBoardState,
} from "../utils/localStorage"
import useDebounce from "./useDebounce"

const DEBOUNCE_DELAY_MS = 1000

export default function useSingleGame() {
  const [status, setStatus] = useState<GameStatus>()
  const boardRef = useRef<Board>()
  const [gameVerion, setGameVersion] = useState(0) // to trigger rerender value must change
  const [bestScore, setBestScore] = useState(0)

  const debouncedHandleBoardData = useDebounce(
    (payload: LocalStorageBoardState | null) => (payload ? storeBoardData(payload) : removeBoardData()),
    DEBOUNCE_DELAY_MS,
  )
  const debouncedStorePlayerData = useDebounce(storePlayerData, DEBOUNCE_DELAY_MS)

  const { score, tileGridStateEncoded } = boardRef.current?.data || {}

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
    if (!boardRef.current?.nextMovePossible) {
      return
    }

    boardRef.current.handleMove(direction) // may update nextMovePossible
    setGameVersion((v) => v + 1)

    if (boardRef.current.score > bestScore) {
      debouncedStorePlayerData({ bestScore: boardRef.current.score })
    }

    if (boardRef.current.nextMovePossible) {
      debouncedHandleBoardData({ score: boardRef.current.score, tileGrid: boardRef.current.tileGrid })
    } else {
      setStatus("finished")
      debouncedHandleBoardData(null)
    }
  }

  const isResetable = gameVerion > 0

  const resetGame = () => {
    if (!isResetable) {
      return
    }
    boardRef.current?.reset()
    setStatus("active")
    setGameVersion(0)
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
