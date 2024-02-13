import styled from "@emotion/styled"

import PlayerBoard from "../components/PlayerBoard"
import MultiDashboard from "../components/MultiDashboard"
import { Lobby } from "../components/Lobby"
import { usePlayer } from "../hooks/usePlayer"
import useMultiplayer from "./useMultiplayer"

const MultiGame = () => {
  const { nickname } = usePlayer()
  const {
    gameState,
    performMove,
    playerBoardState,
    opponentBoardState,
    endGameTimestamp,
  } = useMultiplayer({
    nickname,
  })

  if (!gameState) {
    return <Lobby />
  }

  // TODO this if is ugly af
  if (
    gameState === "loading" ||
    !playerBoardState?.board ||
    typeof playerBoardState?.score !== "number" ||
    !opponentBoardState?.board ||
    typeof opponentBoardState?.score !== "number" ||
    !endGameTimestamp
  ) {
    console.log("multigame early return", {
      gameState,
      playerBoardState,
      opponentBoardState,
      endGameTimestamp,
    })
    return <div>Loading</div>
  }

  return (
    <>
      <MultiGameContainer>
        <MultiDashboard
          score={playerBoardState.score}
          opponentScore={opponentBoardState.score}
          opponentBoard={opponentBoardState.board}
          endTimestamp={endGameTimestamp}
          undoMove={() => {
            /* TODO implement */
          }}
          emitBomb={() => {} /*  TODO implement emitGameEvent("bomb", 250) */}
          emitFreeze={() => {} /* TODO implement emitGameEvent("freeze", 750)*/}
        />
        <PlayerBoard
          board={playerBoardState?.board}
          performMove={performMove}
        />
      </MultiGameContainer>
      {/* {gameResult && (
            <GameResult gameResult={gameResult} playAgain={playAgain} />
          )} */}
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
