import styled from "@emotion/styled"
import { usePlayer } from "../contexts/PlayerContext"
import COLORS from "../styles/colors"
import StyledLink, { LinkList } from "../components/StyledLink"
import { mediaQueries } from "../styles"

function Home() {
  const { nickname, setNickname, bestScore } = usePlayer()!

  return (
    <HomePage>
      <Heading>2048.vs</Heading>
      <BestScore>Best score: {bestScore}</BestScore>
      <NicknameLabel htmlFor="nickname-input">Your nickname:</NicknameLabel>
      <NicknameInput value={nickname} onChange={(e) => setNickname(e.target.value)} id="nickname-input" />

      <LinkList>
        <StyledLink href="/singleplayer" bgColor="green">
          Singleplayer
        </StyledLink>
        <StyledLink href="/multiplayer" bgColor="blue">
          Multiplayer
        </StyledLink>
      </LinkList>
    </HomePage>
  )
}

export default Home

const HomePage = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 12,
  gap: "1.2em",

  [mediaQueries.tabletPortrait]: {
    fontSize: 16,
  },

  [mediaQueries.largeTabletPortrait]: {
    gap: "1.5em",
  },
  [mediaQueries.laptop]: {
    gap: "2em",
  },
})

const Heading = styled.h1({
  fontSize: "7em",
  lineHeight: "2em",
  fontWeight: 500,
  margin: 0,
})

const BestScore = styled.p({
  textAlign: "center",
  fontSize: "2em",
  margin: 0,
})

const NicknameLabel = styled.label({
  fontSize: "2em",
  margin: 0,
})

const NicknameInput = styled.input({
  fontSize: "2.5em",
  background: COLORS.warmGray,
  color: COLORS.font,
  borderRadius: "1rem",
  border: "none",
  padding: "0.25em 0",
  textAlign: "center",
})
