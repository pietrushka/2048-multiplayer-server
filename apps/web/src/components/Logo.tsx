import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import COLORS from "../styles/colors"

export default function Logo() {
  return (
    <Background>
      <Tile bgColor={COLORS.warmGray} color={COLORS.font}>
        <TileSpan>2</TileSpan>
      </Tile>
      <Tile bgColor="#f2b179">
        <TileSpan>0</TileSpan>
      </Tile>
      <Tile bgColor="#f67c5f">
        <TileSpan>4</TileSpan>
      </Tile>
      <Tile bgColor="#ede0c8" color={COLORS.font}>
        <TileSpan>8</TileSpan>
      </Tile>
      <Tile bgColor="#f2b179">
        <TileSpan>v</TileSpan>
      </Tile>
      <Tile bgColor="#f67c5f">
        <TileSpan>s</TileSpan>
      </Tile>
    </Background>
  )
}

const logoAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(95%) scale(1.4);
  }

  10% {
    opacity: 1;
    transform: translateY(120%) scale(1.5);
  }

  100% {
    transform: translateY(0%) scale(1);
  }
`

const Background = styled.div({
  fontSize: 20,
  background: COLORS.board,
  border: `0.5em solid ${COLORS.board}`,
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: "0.5em",
  borderRadius: ".5em",
  margin: "2em 0",
  boxSizing: "content-box",
  height: "4em",
  animation: `${logoAnimation} 1000ms ease-in-out`,
})

const Tile = styled.div<{ bgColor: string; color?: string }>(({ bgColor, color }) => ({
  fontSize: "2em",
  width: "2em",
  height: "2em",
  fontWeight: "bold",
  lineHeight: 0,
  borderRadius: ".1em",
  color: color ? color : COLORS.lightFont,
  background: bgColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))

const TileSpan = styled.span({
  display: "block",
  textAlign: "center",
  fontSize: "1.5em",
  lineHeight: 0,
})
