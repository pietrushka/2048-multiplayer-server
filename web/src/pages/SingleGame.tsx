import React, { useEffect } from "react"
import styled from "@emotion/styled"

import GameResult from "../components/GameResult"
import TileGrid from "../components/TileGrid"
import Dashboard from "../components/SingleDashboard"
import { useGame } from "../hooks/useGame"

function SingleGame() {
  const { setInitials, gameResult, startSingleplayer, resetGame } = useGame()

  useEffect(() => {
    startSingleplayer()
    return () => setInitials()
  }, [])

  return (
    <div> not working </div>
    // <SingleGameContainer>
    //   <Dashboard />
    //   <TileGrid />
    //   {
    //     gameResult && <GameResult gameResult={gameResult} playAgain={resetGame} />
    //   }
    // </SingleGameContainer>
  )
}

export default SingleGame

const SingleGameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`
