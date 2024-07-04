import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import COLORS from "../styles/colors"
import { mediaQueries } from "../styles"

export default function Logo({ shouldAnimate }: { shouldAnimate: boolean }) {
  return (
    <Background shouldAnimate={shouldAnimate}>
      <Tile index={0} bgColor={COLORS.warmGray} color={COLORS.font} shouldAnimate={shouldAnimate}>
        <TileSpan>2</TileSpan>
      </Tile>
      <Tile index={1} bgColor="#f2b179" shouldAnimate={shouldAnimate}>
        <TileSpan>0</TileSpan>
      </Tile>
      <Tile index={2} bgColor="#f67c5f" shouldAnimate={shouldAnimate}>
        <TileSpan>4</TileSpan>
      </Tile>
      <Tile index={3} bgColor="#ede0c8" color={COLORS.font} shouldAnimate={shouldAnimate}>
        <TileSpan>8</TileSpan>
      </Tile>
      <Tile index={4} bgColor="#f2b179" shouldAnimate={shouldAnimate}>
        <TileSpan>v</TileSpan>
      </Tile>
      <Tile index={5} bgColor="#f67c5f" shouldAnimate={shouldAnimate}>
        <TileSpan>s</TileSpan>
      </Tile>
    </Background>
  )
}

const logoAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100%) scale(0.9);
  }

  100% {
    transform: translateY(0%) scale(1);
  }
`

const Background = styled.div<{ shouldAnimate: boolean }>(({ shouldAnimate }) => ({
  fontSize: 12,
  background: COLORS.board,
  border: `0.5em solid ${COLORS.board}`,
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: "0.5em",
  borderRadius: ".5em",
  margin: "2em 0",
  boxSizing: "content-box",
  height: "4em",
  ...(shouldAnimate
    ? {
        animation: `${logoAnimation} 300ms ease-in-out`,
      }
    : {}),
  [mediaQueries.tabletPortrait]: {
    fontSize: 20,
  },
  [mediaQueries.largeScreen]: {
    fontSize: 25,
  },
}))

const Tile = styled.div<{ bgColor: string; color?: string; index: number; shouldAnimate: boolean }>(
  ({ bgColor, color, index, shouldAnimate }) => ({
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
    ...(shouldAnimate
      ? {
          transform: "scale(0)",
          animation: `tileSpawn 300ms forwards`,
          animationDelay: `${300 + index * 200}ms`,
        }
      : {}),
  }),
)

const TileSpan = styled.span({
  display: "block",
  textAlign: "center",
  fontSize: "1.5em",
  lineHeight: 0,
})
