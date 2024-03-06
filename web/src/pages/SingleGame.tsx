import styled from "@emotion/styled"
import Board from "../components/Board"
import GameResult from "../components/GameResult"
import SingleDashboard from "../components/SingleDashboard"
import useSingleGame from "../hooks/useSingleGame"
import { usePlayer } from "../hooks/usePlayer"

function SingleGame() {
  const { bestScore, setBestScore } = usePlayer()!
  const { status, score, tileGrid, performMove, resetGame, isResetable, direction } = useSingleGame({
    bestScore,
    setBestScore,
  })

  if (typeof tileGrid === "undefined" || typeof score === "undefined") {
    return <span>loading</span>
  }
  return (
    <SingleGameContainer>
      <SingleDashboard score={score} bestScore={bestScore} playAgain={resetGame} isResetable={isResetable} />
      <Board tileGrid={tileGrid} direction={direction} performMove={performMove} />
      {status === "finished" && <GameResult result="Game End" playAgain={resetGame} />}
    </SingleGameContainer>
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
