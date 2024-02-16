import styled from "@emotion/styled"

import TileGrid from "../components/TileGrid"
import MultiDashboard from "../components/MultiDashboard"
import { Lobby } from "../components/Lobby"
import { usePlayer } from "../hooks/usePlayer"
import useMultiplayer from "../hooks/useMultiplayer"

const MultiGame = () => {
  const { nickname } = usePlayer()!
  const { gameState, performMove, playerBoardState, opponentBoardState, endGameTimestamp } = useMultiplayer({
    nickname,
  })

  if (!gameState) {
    return <Lobby />
  }

  // TODO this if is ugly af
  if (
    gameState === "loading" ||
    !playerBoardState?.tileGrid ||
    typeof playerBoardState?.score !== "number" ||
    !opponentBoardState?.tileGrid ||
    typeof opponentBoardState?.score !== "number" ||
    !endGameTimestamp
  ) {
    return <div>Loading</div>
  }

  return (
    <>
      <MultiGameContainer>
        <MultiDashboard
          score={playerBoardState.score}
          opponentScore={opponentBoardState.score}
          opponentTileGrid={opponentBoardState.tileGrid}
          endTimestamp={endGameTimestamp}
          undoMove={() => {
            /* TODO implement */
          }}
          emitBomb={() => {} /*  TODO implement emitGameEvent("bomb", 250) */}
          emitFreeze={() => {} /* TODO implement emitGameEvent("freeze", 750)*/}
        />
        <TileGrid tileGrid={playerBoardState?.tileGrid} performMove={performMove} />
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
