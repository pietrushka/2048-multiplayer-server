import styled from "@emotion/styled"
import Board from "../components/Board"
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
      <MultiGameContainer>
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
      </MultiGameContainer>
      {resultText && <GameResult result={resultText} playAgain={playAgain} />}
    </>
  )
}

export default MultiGame

const MultiGameContainer = styled.div({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  minHeight: "90vh",
})
