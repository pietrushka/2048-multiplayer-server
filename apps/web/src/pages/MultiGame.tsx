import Board from "../components/Board"
import MultiDashboard from "../components/MultiDashboard"
import Lobby from "../components/Lobby"
import GameResult from "../components/GameResult"
import Settings from "../components/Settings"
import Countdown from "../components/Countdown"
import useMultiplayer from "../hooks/useMultiplayer"
import { GameContainer } from "../styles"

export default function MultiGame() {
  const {
    status,
    countdownSeconds,
    performMove,
    playerBoardState,
    opponentBoardState,
    endGameTimestamp,
    resultText,
    privateLobbyId,
  } = useMultiplayer()

  if (!status) {
    return <Lobby privateLobbyId={privateLobbyId} />
  }

  if (status === "countdown" && typeof countdownSeconds === "number") {
    return <Countdown initialCount={4} onCountdownEnd={() => console.log("countdown ended")} />
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
