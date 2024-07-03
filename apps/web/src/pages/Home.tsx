import styled from "@emotion/styled"
import StyledLink, { LinkList } from "../components/StyledLink"
import { mediaQueries } from "../styles"
import Navbar from "../components/Navbar"
import AuthModal from "../components/AuthModal"
import { useAuth } from "../contexts/AuthContext"
import Leaderboard from "../components/Leaderboard"

export default function Home() {
  const { user } = useAuth()
  const nickname = user?.nickname || "Guest"
  const totalScore = user?.totalScore || 0

  return (
    <HomePage>
      <Navbar />
      <AuthModal />

      <LogoText>2048.vs</LogoText>

      <SubHeading>Hi, {nickname}</SubHeading>
      <SubHeading>Your score: {totalScore}</SubHeading>

      <Leaderboard />

      <LinkList>
        <StyledLink href="/singleplayer" bgColor="green">
          Singleplayer
        </StyledLink>
        <StyledLink href="/multiplayer/global" bgColor="blue">
          Multiplayer
        </StyledLink>

        <StyledLink href="/multiplayer/private" bgColor="blue">
          Private Lobby
        </StyledLink>
      </LinkList>
    </HomePage>
  )
}

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

const LogoText = styled.h1({
  fontSize: "7em",
  lineHeight: "2em",
  fontWeight: 500,
  margin: 0,
})

const SubHeading = styled.h2({
  fontSize: "2em",
  fontWeight: 500,
  margin: 0,
})
