import styled from "@emotion/styled"
import Timer from "./Timer"
import TileGrid from "./TileGrid"
import { DashboardScore, GameButton, mediaQueries } from "../styles"

interface MultiDashboardProps {
  score: number
  opponentScore: number
  opponentTileGridStateEncoded: string
  endTimestamp: string
  undoMove: () => void
  emitBomb: () => void
  emitFreeze: () => void
}

function MultiDashboard({
  score,
  undoMove,
  opponentScore,
  opponentTileGridStateEncoded,
  endTimestamp,
  emitBomb, // TODO
  emitFreeze, // TODO
}: MultiDashboardProps) {
  return (
    <>
      <StatsContainer>
        <DashboardScore>
          <h3>Opponent</h3>
          <span>{opponentScore}</span>
        </DashboardScore>
        <DashboardScore>
          <h3>You</h3>
          <span>{score}</span>
        </DashboardScore>
        <DashboardScore>
          <h3>Time</h3>
          <Timer endTimestamp={endTimestamp} />
        </DashboardScore>
      </StatsContainer>

      <BottomSection>
        <OpponentTileGrid>
          {opponentTileGridStateEncoded && <TileGrid tileGridStateEncoded={opponentTileGridStateEncoded} />}
        </OpponentTileGrid>

        {/* <ButtonsContainer>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", fontSize: "inherit" }}>
            <GameButton onClick={emitBomb} disabled={score < 250 ? true : false}>
              <h4>Bomb</h4>
              <span>250 points</span>
            </GameButton>
            <GameButton onClick={emitFreeze} disabled={score < 750 ? true : false}>
              <h4>Freeze</h4>
              <span>750 points</span>
            </GameButton>
          </div>
          <GameButton onClick={undoMove}>
            <h4>Undo</h4>
          </GameButton>
        </ButtonsContainer> */}
      </BottomSection>
    </>
  )
}

export default MultiDashboard

const StatsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "3%",
})

const BottomSection = styled.div({
  display: "flex",
  justifyContent: "space-between",
})

const OpponentTileGrid = styled.div({
  width: "40%",
})

// const ButtonsContainer = styled.div({
//   width: "55%",
//   display: "flex",
//   flexDirection: "column",
//   fontSize: 14,

//   [mediaQueries.tabletPortrait]: {
//     fontSize: 18,
//   },

//   [mediaQueries.largeTabletPortrait]: {
//     fontSize: 24,
//   },

//   [mediaQueries.desktop]: {
//     fontSize: 16,
//   },
// })
