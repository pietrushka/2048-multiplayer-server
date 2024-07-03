import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import COLORS from "../styles/colors"
import { mediaQueries } from "../styles"
import { keyframes } from "@emotion/react"

type LeaderboardUser = {
  position: number
  nickname: string
  totalScore: number
}

export default function Leaderboard() {
  const [open, setOpen] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>()

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/leaderboard`, {
        method: "GET",
      })
      const leaderboard = await res.json()
      setLeaderboard(leaderboard)
    }
    fetchLeaderboard()
  }, [])

  return (
    <>
      <Overlay
        open={open}
        onClick={(event) => {
          event.stopPropagation()
          setOpen(false)
        }}
      />
      <Container open={open}>
        <Button onClick={() => setOpen(!open)}>Leaderboard</Button>
        <Table>
          {leaderboard ? (
            leaderboard.map((player) => (
              <Item key={player.position}>
                <ItemText>#{player.position}</ItemText>
                <ItemText>{player.nickname}</ItemText>
                <ItemText>{player.totalScore} pts.</ItemText>
              </Item>
            ))
          ) : (
            <span>Loading...</span>
          )}
        </Table>
      </Container>
    </>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Overlay = styled.div<{ open: boolean }>(({ open }) => ({
  display: open ? "block" : "none",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  backgroundColor: "rgba(0, 0, 0, 0.15)",
}))

const Container = styled.div<{ open: boolean }>(({ open }) => ({
  fontSize: 15,
  position: "absolute",
  display: "flex",
  top: "10vh",
  transition: "right 0.3s ease-in-out",
  zIndex: 101,
  right: open ? 0 : "-20em",
  opacity: 0,
  animation: `${fadeIn} 500ms forwards`,
  animationDelay: "1000ms",

  [mediaQueries.laptop]: {
    fontSize: 20,
  },
  [mediaQueries.largeScreen]: {
    fontSize: 25,
  },
}))

const Button = styled.button({
  fontSize: "0.8em",
  height: "fit-content",
  width: "3em",
  padding: ".5em 0",
  backgroundColor: COLORS.board,
  color: COLORS.warmGray,
  writingMode: "vertical-rl",
  textOrientation: "upright",
  fontWeight: "bold",
  cursor: "pointer",
  borderRight: "none",
  borderTopLeftRadius: "0.5em",
  borderBottomLeftRadius: "0.5em",
  lineHeight: 0,
})

const Table = styled.div({
  width: "20em",
  border: `2px solid ${COLORS.charcoal}`,
  backgroundColor: COLORS.board,
  color: COLORS.warmGray,
  boxSizing: "border-box",
})

const Item = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: ".5em",
  borderBottom: `2px solid ${COLORS.charcoal}`,
})

const ItemText = styled.span({})
