import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import StyledLink, { LinkList } from "../components/StyledLink"
import { mediaQueries } from "../styles"
import Navbar from "../components/Navbar"
import AuthModal from "../components/AuthModal"
import { useAuth } from "../contexts/AuthContext"
import Leaderboard from "../components/Leaderboard"
import Logo from "../components/Logo"
import useWelcomeAnimation from "../hooks/useWelcomeAnimation"

export default function Home() {
  const { user } = useAuth()
  const nickname = user?.nickname || "Guest"
  const totalScore = user?.totalScore || 0
  const shouldAnimate = useWelcomeAnimation()

  return (
    <div>
      <Logo shouldAnimate={shouldAnimate} />
      <Navbar shouldAnimate={shouldAnimate} />
      <AuthModal />
      <Leaderboard shouldAnimate={shouldAnimate} />
      <CentralSection shouldAnimate={shouldAnimate}>
        <SubHeading>Hi, {nickname}</SubHeading>
        <SubHeading>Your score: {totalScore}</SubHeading>
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
      </CentralSection>
    </div>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const CentralSection = styled.div<{ shouldAnimate: boolean }>(({ shouldAnimate }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 12,
  gap: "1.2em",

  ...(shouldAnimate
    ? {
        opacity: 0,
        animation: shouldAnimate ? `${fadeIn} 500ms forwards` : "none",
        animationDelay: "1000ms",
      }
    : {}),

  [mediaQueries.tabletPortrait]: {
    fontSize: 16,
  },

  [mediaQueries.largeTabletPortrait]: {
    gap: "1.5em",
  },
  [mediaQueries.laptop]: {
    gap: "2em",
  },
}))

const SubHeading = styled.h2({
  fontSize: "2em",
  fontWeight: 500,
  margin: 0,
})
