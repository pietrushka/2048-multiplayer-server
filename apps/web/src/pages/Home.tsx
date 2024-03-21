import styled from "@emotion/styled"
import { usePlayer } from "../hooks/usePlayer"
import COLORS from "../styles/colors"
import StyledLink, { LinkList } from "../components/StyledLink"

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
})

const Heading = styled.div({
  fontSize: "5rem",
  margin: "0 0 1rem 0",
  "@media (min-width: 480px)": {
    fontSize: "6rem",
  },
  "@media (min-width: 768px)": {
    fontSize: "7rem",
  },
  "@media (min-width: 1024px)": {
    fontSize: "6rem",
  },
})

const BestScore = styled.p({
  margin: "1em auto",
  textAlign: "center",
  fontSize: "1.25rem",
})

const NicknameLabel = styled.label({
  display: "block",
  margin: "0 auto",
  textAlign: "center",
  fontSize: "1.25rem",
  "@media (min-width: 480px)": {
    fontSize: "1.5rem",
  },
  "@media (min-width: 768px)": {
    fontSize: "1.75rem",
  },
  "@media (min-width: 1024px)": {
    fontSize: "1.5rem",
  },
})

const NicknameInput = styled.input({
  minwidth: "300px",
  background: COLORS.warmGray,
  color: COLORS.font,
  borderRadius: "1rem",
  border: "none",
  fontSize: "1.5rem",
  margin: "0.25em 0",
  padding: "0.25em 0.25em",
  textAlign: "center",

  "@media (min-width: 480px)": {
    fontSize: "1.75rem",
  },
  "@media (min-width: 768px)": {
    fontSize: "2rem",
  },
  "@media (min-width: 1024px)": {
    fontSize: "1.75rem",
  },
})
