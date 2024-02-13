import { useEffect, useState, useRef, useCallback } from "react"
import io, { Socket } from "socket.io-client"
import { SIGNALS } from "../common/constants"
import {
  BoardState,
  GameState,
  StartGamePayload,
  BoardsStateUpdatePayload,
  Move,
} from "../common/types"
import clientEmitter from "../utils/clientEmitter"

const SERVER_URL =
  process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:4000"

type UseMultiplayerProps = {
  nickname: string
}

const getPlayersBoardState = (
  boardStates: Record<string, BoardState>,
  playerSocketId?: string
) => {
  console.log("getPlayersBoardState, boardStates", boardStates)
  let playerBoardState, opponentBoardState
  if (!playerSocketId) {
    return { playerBoardState, opponentBoardState }
  }

  playerBoardState = boardStates[playerSocketId]
  const opponentBoardId = Object.keys(boardStates).find(
    (id) => id !== playerSocketId
  )
  if (opponentBoardId) {
    opponentBoardState = boardStates[opponentBoardId]
  } else {
    console.log("Opponent's board not found.")
  }
  console.log("getPlayersBoardState", { playerBoardState, opponentBoardState })

  return { playerBoardState, opponentBoardState }
}

const useMultiplayer = (props: UseMultiplayerProps) => {
  const { nickname } = props

  const socketIo = useRef<Socket>()
  const [gameState, setGameState] = useState<GameState>()
  const [endGameTimestamp, setendGameTimestamp] = useState<string>()
  const [playerBoardState, setPlayerBoardState] = useState<BoardState>()
  const [opponentBoardState, setOpponentBoardState] = useState<BoardState>()

  // Connect to the socket server
  useEffect(() => {
    socketIo.current = io(SERVER_URL)

    clientEmitter(socketIo.current, {
      signal: SIGNALS.join,
      data: { nickname },
    })
    socketIo.current.on(SIGNALS.startGame, handleGameStart)
    socketIo.current.on(SIGNALS.boardUpdate, handleBoardStateUpdate)
    // socketIo.current.on(SIGNALS.gameEnd)

    return () => {
      if (socketIo.current) {
        socketIo.current.disconnect()
      }
    }
  }, [nickname])

  const handleGameStart = (data: StartGamePayload) => {
    console.log("handleGameStart", data)
    setGameState(data.state)
    setendGameTimestamp(data.endGameTimestamp)
    const boardStates = getPlayersBoardState(data.boards, socketIo.current?.id)

    setPlayerBoardState(boardStates.playerBoardState)
    setOpponentBoardState(boardStates.opponentBoardState)
  }

  const handleBoardStateUpdate = (data: BoardsStateUpdatePayload) => {
    console.log("handleBoardStateUpdate", socketIo.current?.id, data)
    const boardStates = getPlayersBoardState(data.boards, socketIo.current?.id)
    console.log("boardStates:", boardStates)
    setPlayerBoardState(boardStates.playerBoardState)
    setOpponentBoardState(boardStates.opponentBoardState)
  }

  // TODO useCallback
  const performMove = (move: Move) => {
    clientEmitter(socketIo.current, { signal: SIGNALS.move, data: { move } })
  }

  return {
    gameState,
    endGameTimestamp,
    playerBoardState,
    opponentBoardState,
    performMove,
  }
}

export default useMultiplayer
