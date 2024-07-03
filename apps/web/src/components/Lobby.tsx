import styled from "@emotion/styled"
import { ButtonLikeLink } from "./Common"
import Clock from "./Clock"
import CopyButton from "./CopyButton"
import MagnifyingGlass from "./MagnifyingGlass"

type LobbyProps = {
  privateLobbyId?: string
}

export default function Lobby({ privateLobbyId }: LobbyProps) {
  if (privateLobbyId) {
    return (
      <PageContainer>
        <Clock />
        <LobbyText>
          You are the host of privete lobby, click button bellow to copy invite link and send it to your friend.
          <br />
          Game will start when second player joins.
        </LobbyText>
        <Options>
          <CopyButton text={`${process.env.REACT_APP_CLIENT_URL}/multiplayer/private?id=${privateLobbyId}`} />
          <ButtonLikeLink href="/">Exit</ButtonLikeLink>
        </Options>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <MagnifyingGlass />
      <LobbyText>Looking for an opponent</LobbyText>
    </PageContainer>
  )
}

const PageContainer = styled.div({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1em",
})

const LobbyText = styled.p({
  fontSize: "1.5em",
  textAlign: "center",
  lineHeight: "1.8em",
})

const Options = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "1rem 0",
  minWidth: 300,
  gap: "1.5em",
})
