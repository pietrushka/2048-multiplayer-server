import styled from "@emotion/styled"

import TileGrid from "../components/TileGrid"
import MultiDashboard from "../components/MultiDashboard"
import { Lobby } from "../components/Lobby"
import { usePlayer } from "../hooks/usePlayer"
import useMultiplayer from "../hooks/useMultiplayer"
import GameResult from "../components/GameResult"

const MultiGame = () => {
  const { nickname } = usePlayer()!
  const { status, performMove, playerBoardState, opponentBoardState, endGameTimestamp, resultText, playAgain } =
    useMultiplayer({
      nickname,
    })

  if (!status) {
    return <Lobby />
  }

  // TODO this if is ugly af
  if (
    status === "loading" ||
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
      {resultText && <GameResult result={resultText} playAgain={playAgain} />}
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
