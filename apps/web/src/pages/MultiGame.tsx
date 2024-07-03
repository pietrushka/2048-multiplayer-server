import Board from "../components/Board"
import MultiDashboard from "../components/MultiDashboard"
import Lobby from "../components/Lobby"
import useMultiplayer from "../hooks/useMultiplayer"
import GameResult from "../components/GameResult"
import { GameContainer } from "../styles"
import Settings from "../components/Settings"

const MultiGame = () => {
  const { status, performMove, playerBoardState, opponentBoardState, endGameTimestamp, resultText, privateLobbyId } =
    useMultiplayer()

  if (!status) {
    return <Lobby privateLobbyId={privateLobbyId} />
  }

  // TODO this if is ugly af
  if (
    status === "loading" ||
    !playerBoardState?.tileGridStateEncoded ||
    typeof playerBoardState?.score !== "number" ||
    !opponentBoardState?.tileGridStateEncoded ||
    typeof opponentBoardState?.score !== "number" ||
    !endGameTimestamp
  ) {
    return <div>Loading</div>
  }

  return (
    <>
      <Settings />
      <GameContainer>
        <MultiDashboard
          score={playerBoardState.score}
          opponentScore={opponentBoardState.score}
          opponentTileGridStateEncoded={opponentBoardState.tileGridStateEncoded}
          endTimestamp={endGameTimestamp}
          undoMove={() => {
            /* TODO implement */
          }}
          emitBomb={() => {} /*  TODO implement emitGameEvent("bomb", 250) */}
          emitFreeze={() => {} /* TODO implement emitGameEvent("freeze", 750)*/}
        />
        <Board tileGridStateEncoded={playerBoardState.tileGridStateEncoded} performMove={performMove} />
      </GameContainer>
      {resultText && <GameResult result={resultText} />}
    </>
  )
}

export default MultiGame
