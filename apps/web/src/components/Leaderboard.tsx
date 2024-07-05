import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import COLORS from "../styles/colors"
import { Button } from "./Common"
import { MdOutlineLeaderboard } from "react-icons/md"
import Modal from "./Modal"

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
      <Button onClick={() => setOpen(!open)}>
        Leaderboard <MdOutlineLeaderboard />
      </Button>
      {open ? (
        <Modal bgColor={COLORS.warmGray} closeModal={() => setOpen(false)}>
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
        </Modal>
      ) : null}
    </>
  )
}

const Table = styled.div({
  width: "20em",
  backgroundColor: COLORS.warmGray,
  color: COLORS.font,
  boxSizing: "border-box",
  padding: "0.5em",
})

const Item = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: ".5em",
  borderBottom: `2px solid ${COLORS.charcoal}`,
})

const ItemText = styled.span({})
