import React, { useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"
import styled from "@emotion/styled"

import PlayerBoard from "../components/PlayerBoard"
import MultiDashboard from "../components/MultiDashboard"
import { Lobby } from "../components/Lobby"
import { useGame } from "../hooks/useGame"
import { usePlayer } from "../hooks/usePlayer"
import GameResult from "../components/GameResult"
import { startMultiplayerI, updateMultiplayerI } from "../types/useGame.types"

const MultiGame = () => {
  const {
    board,
    score,
    setInitials,
    startMultiplayer,
    updateMultiplayer,
    resultMultiplayer,
    gameId,
    gameResult,
    handleGameEvent,
    decreasePoints,
    handleOpponentLost,
  } = useGame()
  const { nickname } = usePlayer()
  const socket = useRef<Socket | null>(null)

  console.log(process.env)
  const SERVER_ENDPOINT =
    process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:4000"

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SERVER_ENDPOINT)
    socket.current.emit("join", { nickname })

    socket.current.on("start-game", (data: startMultiplayerI) => {
      console.log("start game")
      startMultiplayer(data)
    })
    socket.current.on("move", (data: updateMultiplayerI) =>
      updateMultiplayer(data)
    )
    socket.current.on("game-event", (data: { type: string }) =>
      handleGameEvent(data.type)
    )
    socket.current.on("end-game", () => resultMultiplayer())
    socket.current.on("opponent-lost", () => handleOpponentLost())

    // Cleanup on component unmount or before re-running the effect
    return () => {
      socket.current?.disconnect()
      socket.current = null
      setInitials()
    }
  }, [
    nickname,
    startMultiplayer,
    updateMultiplayer,
    resultMultiplayer,
    handleGameEvent,
    handleOpponentLost,
    setInitials,
  ])

  useEffect(() => {
    if (gameId && board && score !== null) {
      socket.current?.emit("move", { board, score })
    }
  }, [gameId, board, score])

  if (gameResult) {
    socket.current?.emit(gameResult === "defeat" ? "player-lost" : "end-game")
    // Consider handling socket disconnection and game reset logic here
  }

  const emitGameEvent = (type: string, cost: number) => {
    if (socket.current) {
      socket.current.emit("game-event", { type })
    }
    decreasePoints(cost)
  }

  const playAgain = () => {
    window.location.reload()
  }
  return (
    <>
      {gameId ? (
        <>
          <MultiGameContainer>
            <MultiDashboard
              emitBomb={() => emitGameEvent("bomb", 250)}
              emitFreeze={() => emitGameEvent("freeze", 750)}
            />
            <PlayerBoard />
          </MultiGameContainer>
          {gameResult && (
            <GameResult gameResult={gameResult} playAgain={playAgain} />
          )}
        </>
      ) : (
        <Lobby />
      )}
    </>
  )
}

export default MultiGame

const MultiGameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`
