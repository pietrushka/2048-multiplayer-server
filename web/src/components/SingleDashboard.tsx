import { css } from "@emotion/react"
import styled from "@emotion/styled"

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
    <DashboardContainer>
      <ScoreGroup>
        <Score>
          <h3>Best:</h3>
          <p>{bestScore ? (bestScore >= score ? bestScore : score) : score}</p>
        </Score>
        <Score>
          <h3>Score:</h3>
          <p>{score}</p>
        </Score>
      </ScoreGroup>
      <ButtonsGroup>
        <Button onClick={playAgain} disabled={!isResetable}>
          New game
        </Button>
        {/* <Button onClick={undoMove}>Undo</Button> */}
      </ButtonsGroup>
    </DashboardContainer>
  )
}

export default SingleDashboard

const DashboardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`

const ScoreGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const Score = styled.div`
  width: 45%;
  text-align: center;
  background: #ede0c8;
  color: #776e65;
  border-radius: 0.5em;
  h3 {
    font-size: 1.25rem;
    margin: 0.5em 0;
  }
  p {
    font-size: 1.1rem;
    margin: 0.5em 0;
  }
`

const ButtonsGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`
const Button = styled.button<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled
      ? css`
          filter: grayscale(1);
        `
      : {}}
  font-size: 1.5rem;
  margin: 0.5em 0;
  width: 40%;
  padding: 0.25em 0;
  background: #eee4da;
  color: #776e65;
  border-radius: 0.5em;
`
