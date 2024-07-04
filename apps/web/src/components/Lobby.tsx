import styled from "@emotion/styled"
import { MdOutlineCancel } from "react-icons/md"
import { ButtonLikeLink } from "./Common"
import Loading from "./Loading"
import CopyButton from "./CopyButton"
import MagnifyingGlass from "./MagnifyingGlass"

type LobbyProps = {
  privateLobbyId?: string
}

export default function Lobby({ privateLobbyId }: LobbyProps) {
  if (privateLobbyId) {
    return (
      <PageContainer>
        <Loading />
        <LobbyText>Waiting for other players... (1/2)</LobbyText>
        <Options>
          <CopyButton text={`${process.env.REACT_APP_CLIENT_URL}/multiplayer/private?id=${privateLobbyId}`} />
          <ButtonLikeLink href="/">
            Exit <MdOutlineCancel />
          </ButtonLikeLink>
        </Options>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <MagnifyingGlass />
      <LobbyText>Looking for an opponent</LobbyText>
      <Options>
        <ButtonLikeLink href="/">
          Exit <MdOutlineCancel />
        </ButtonLikeLink>
      </Options>
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
  minWidth: 200,
  gap: "1.5em",
})
