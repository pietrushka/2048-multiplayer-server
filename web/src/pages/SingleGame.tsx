import styled from "@emotion/styled"
import TileGrid from "../components/TileGrid"
import GameResult from "../components/GameResult"
import SingleDashboard from "../components/SingleDashboard"
import useSingleGame from "../hooks/useSingleGame"
import { usePlayer } from "../hooks/usePlayer"

function SingleGame() {
  const { bestScore, setBestScore } = usePlayer()!
  const { state, score, tileGrid, performMove, resetGame } = useSingleGame({ bestScore, setBestScore })

  if (typeof tileGrid === "undefined" || typeof score === "undefined") {
    return <span>loading</span>
  }
  return (
    <SingleGameContainer>
      <SingleDashboard score={score} bestScore={bestScore} />
      <TileGrid tileGrid={tileGrid} performMove={performMove} />
      {state === "finished" && <GameResult playAgain={resetGame} />}
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
