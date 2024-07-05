import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { LuSwords } from "react-icons/lu"
import { FaUserFriends } from "react-icons/fa"
import { FaPlayCircle } from "react-icons/fa"
import { LinkList } from "../components/StyledLink"
import { mediaQueries } from "../styles"
import Navbar from "../components/Navbar"
import AuthModal from "../components/AuthModal"
import { useAuth } from "../contexts/AuthContext"
import Leaderboard from "../components/Leaderboard"
import Logo from "../components/Logo"
import useWelcomeAnimation from "../hooks/useWelcomeAnimation"
import { ButtonLikeLink } from "../components/Common"

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
      <CentralSection shouldAnimate={shouldAnimate}>
        <SubHeading>Hi, {nickname}</SubHeading>
        <SubHeading>Your score: {totalScore}</SubHeading>
        <LinkList>
          <ButtonLikeLink href="/multiplayer/global">
            Fight
            <LuSwords />
          </ButtonLikeLink>

          <ButtonLikeLink href="/multiplayer/private">
            Invite a friend <FaUserFriends />
          </ButtonLikeLink>
          <ButtonLikeLink href="/singleplayer">
            Play solo <FaPlayCircle />
          </ButtonLikeLink>

          <Leaderboard />
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
  fontSize: "1rem",
  gap: "1.2em",
  paddingTop: "2em",

  ...(shouldAnimate
    ? {
        opacity: 0,
        animation: shouldAnimate ? `${fadeIn} 300ms forwards` : "none",
        animationDelay: "1200ms",
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
  fontSize: "1.7em",
  fontWeight: 500,
  margin: 0,
})
