import styled from "@emotion/styled"
import { DashboardScore, GameButton, mediaQueries } from "../styles"

type SinglePlayerDashBoardProps = {
  score: number
  bestScore: number
  // TODO
  // undoMove: () => void
  playAgain: () => void
  isResetable: boolean
}

function SingleDashboard({ score, bestScore, playAgain, isResetable }: SinglePlayerDashBoardProps) {
  return (
    <>
      <StatsContainer>
        <DashboardScore>
          <h3>Best:</h3>
          <span>{bestScore ? (bestScore >= score ? bestScore : score) : score}</span>
        </DashboardScore>
        <DashboardScore>
          <h3>Score:</h3>
          <span>{score}</span>
        </DashboardScore>
      </StatsContainer>
      <ButtonsContainer>
        <GameButton onClick={playAgain} disabled={!isResetable}>
          <span>New game</span>
        </GameButton>
        {/* <Button onClick={undoMove}>Undo</Button> */}
      </ButtonsContainer>
    </>
  )
}

export default SingleDashboard

const StatsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "4%",
})

const ButtonsContainer = styled.div({
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  fontSize: 20,
  [mediaQueries.largeTabletPortrait]: {
    fontSize: 25,
  },
})
