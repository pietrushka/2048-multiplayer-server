import Board from "../components/Board"
import GameResult from "../components/GameResult"
import SingleDashboard from "../components/SingleDashboard"
import useSingleGame from "../hooks/useSingleGame"
import { usePlayer } from "../hooks/usePlayer"
import { GameContainer } from "../styles"
import Settings from "../components/Settings"

function SingleGame() {
  const { bestScore, setBestScore } = usePlayer()!
  const { status, score, tileGridStateEncoded, performMove, resetGame, isResetable } = useSingleGame({
    bestScore,
    setBestScore,
  })

  if (typeof tileGridStateEncoded === "undefined" || typeof score === "undefined") {
    return <span>loading</span>
  }
  return (
    <>
      <Settings />
      <GameContainer>
        <SingleDashboard score={score} bestScore={bestScore} playAgain={resetGame} isResetable={isResetable} />
        <Board tileGridStateEncoded={tileGridStateEncoded} performMove={performMove} />
        {status === "finished" && <GameResult result="Game End" />}
      </GameContainer>
    </>
  )
}

export default SingleGame
