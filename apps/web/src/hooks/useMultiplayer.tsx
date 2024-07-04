import { useEffect, useState, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import io, { Socket } from "socket.io-client"
import {
  CLIENT_SIGNALS,
  SERVER_SIGNALS,
  DRAW,
  BoardData,
  GameStatus,
  Move,
  GameData,
  COOKIE_NAMES,
  PrivateLobbyData,
} from "shared-logic"
import clientEmitter from "../utils/clientEmitter"
import { gePlayerIdentifier } from "../utils/playerIdentifierUtils"

const getPlayersBoardState = (boards: BoardData[], playerSocketId: string) => {
  const playerBoardState = boards.find((board) => board.playerId === playerSocketId)
  const opponentBoardState = boards.find((board) => board.playerId !== playerSocketId)
  return { playerBoardState, opponentBoardState }
}

const generateResultText = (winner?: string) => {
  const playerIdentifier = gePlayerIdentifier()
  if (!playerIdentifier || !winner) {
    return
  }

  if (winner === DRAW) {
    return "It is a draw"
  }

  return winner === playerIdentifier ? "You won" : "You lost"
}

type MultiplayerGameStatus = {
  status: GameStatus
  endGameTimestamp?: string
  playerBoardState?: BoardData
  opponentBoardState?: BoardData
  winner?: string
}

export default function useMultiplayer() {
  const socketIo = useRef<Socket>()
  const [gameState, setGameStatus] = useState<MultiplayerGameStatus>()
  const [searchParams] = useSearchParams()
  const [privateLobbyId, setPrivateLobbyId] = useState(searchParams.get("id") || undefined)
  const params = useParams()
  const multiplayerType = params.type

  useEffect(() => {
    const playerIdentifier = gePlayerIdentifier()

    if (!playerIdentifier) {
      console.error("useMultiplayer: no playerIdentifier", playerIdentifier)
      return
    }

    socketIo.current = io(process.env.REACT_APP_SERVER_URL as string, {
      // accessToken and playerInentifier are sent as cookies
      withCredentials: true,
      query: {
        [COOKIE_NAMES.PLAYER_IDENTIFIER]: playerIdentifier,
      },
    })

    if (multiplayerType === "private") {
      clientEmitter(socketIo.current, {
        signal: CLIENT_SIGNALS.joinPrivateGame,
        data: { privateLobbyId },
      })
    } else {
      // "global" type
      clientEmitter(socketIo.current, {
        signal: CLIENT_SIGNALS.join,
      })
    }

    socketIo.current.on(SERVER_SIGNALS.startGame, handleStateUpdate)
    socketIo.current.on(SERVER_SIGNALS.boardUpdate, handleStateUpdate)
    socketIo.current.on(SERVER_SIGNALS.endGame, handleStateUpdate)
    socketIo.current.on(SERVER_SIGNALS.joinLobby, handleJoinLobby)
    socketIo.current.on(SERVER_SIGNALS.joinPrivateLobby, handleJoinPrivateLobby)

    const cleanupSocket = async () => {
      if (socketIo.current) {
        socketIo.current.disconnect()
      }
    }
    window.addEventListener("beforeunload", cleanupSocket)

    return () => {
      cleanupSocket()
      window.removeEventListener("beforeunload", cleanupSocket)
    }
  }, [])

  const handleStateUpdate = (data: GameData) => {
    if (!socketIo.current?.id) {
      console.error("handleGameStart: no socketIo.current.id", socketIo.current)
      return
    }
    const { status, endGameTimestamp, boards, winner } = data

    const userIdentifier = gePlayerIdentifier()
    if (!userIdentifier) {
      console.error("handleStateUpdate: no userIdentifier", userIdentifier)
      return // TODO error handling
    }
    const boardStates = getPlayersBoardState(boards, userIdentifier)

    setGameStatus({
      status,
      endGameTimestamp,
      winner,
      playerBoardState: boardStates.playerBoardState,
      opponentBoardState: boardStates.opponentBoardState,
    })
  }

  const handleJoinLobby = () => {
    setGameStatus(undefined)
  }

  function handleJoinPrivateLobby(data: PrivateLobbyData) {
    setPrivateLobbyId(data.privateLobbyId)
  }

  // TODO useCallback
  const performMove = (move: Move) => {
    if (gameState?.status !== "active") {
      return
    }
    clientEmitter(socketIo.current, { signal: CLIENT_SIGNALS.move, data: { move } })
  }

  // TODO useMemo
  const resultText = generateResultText(gameState?.winner)
  return {
    status: gameState?.status,
    endGameTimestamp: gameState?.endGameTimestamp,
    playerBoardState: gameState?.playerBoardState,
    opponentBoardState: gameState?.opponentBoardState,
    resultText,
    performMove,
    privateLobbyId,
  }
}
