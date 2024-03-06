import styled from "@emotion/styled"
import Timer from "./Timer"
// import TileGridDisplay from "./TileGridDisplay"
import { TileGrid } from "../common/types"

interface MultiDashboardProps {
  score: number
  opponentScore: number
  opponentTileGrid: TileGrid
  endTimestamp: string
  undoMove: () => void
  emitBomb: () => void
  emitFreeze: () => void
}

function MultiDashboard({
  score,
  undoMove,
  opponentScore,
  opponentTileGrid,
  endTimestamp,
  emitBomb,
  emitFreeze,
}: MultiDashboardProps) {
  return (
    <DashboardContainer>
      <FirstSection>
        <StatsGroup>
          <Score>
            <h3>Opponent</h3>
            <p>{opponentScore}</p>
          </Score>
          <Score>
            <h3>You</h3>
            <p>{score}</p>
          </Score>
          <Score>
            <h3>Time</h3>
            <Timer endTimestamp={endTimestamp} />
          </Score>
        </StatsGroup>
      </FirstSection>

      <SecondSection>
        {/* {opponentTileGrid && <TileGridDisplay size="small" tileGrid={opponentTileGrid} />} */}
        <ButtonsGroup>
          {/* <ShopBtnsBox>
            <ShopBtn onClick={emitBomb} disabled={score < 250 ? true : false}>
              <h3>Bomb</h3>
              <p>250 points</p>
            </ShopBtn>
            <ShopBtn onClick={emitFreeze} disabled={score < 750 ? true : false}>
              <h3>Freeze</h3>
              <p>750 points</p>
            </ShopBtn>
          </ShopBtnsBox>
          <LargeButton onClick={undoMove}>Undo</LargeButton> */}
        </ButtonsGroup>
      </SecondSection>
    </DashboardContainer>
  )
}

export default MultiDashboard

const DashboardContainer = styled.div`
  width: 93%;
  margin: 0 auto 0.5rem auto;
`

const FirstSection = styled.div`
  margin-bottom: 0.5rem;
`

const StatsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Score = styled.div`
  width: 30%;
  text-align: center;
  background: #ede0c8;
  color: #776e65;
  border-radius: 0.5em;
  h3 {
    font-size: 1.25rem;
    margin: 0.25em 0;
  }
  p {
    font-size: 1.1rem;
    margin: 0.25em 0;
  }
`

const SecondSection = styled.div`
  display: flex;
`

const ButtonsGroup = styled.div`
  margin-left: 0.5rem;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
// const ShopBtnsBox = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `

// const ShopBtn = styled.button`
//   font-size: 1rem;
//   margin: 0.5em 0;
//   padding: 0.75em 0;
//   width: 45%;
//   background: #eee4da;
//   color: #776e65;
//   border-radius: 0.5em;
//   text-align: center;

//   h3 {
//     margin: 0;
//   }

//   p {
//     margin: 0;
//   }
//   &[disabled] {
//     filter: grayscale(1);
//   }
// `

// const LargeButton = styled.button`
//   font-size: 1.5rem;
//   margin: 0.5em 0;
//   width: 90%;
//   padding: 0.25em 0;
//   background: #eee4da;
//   color: #776e65;
//   border-radius: 0.5em;
// `
