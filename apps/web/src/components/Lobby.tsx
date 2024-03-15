// TODO refactor
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import { Menu, MenuOption } from "../pages/Home"
import COLORS from "../styles/colors"

export const Lobby = () => {
  return (
    <PageContainer>
      <MagnifyingGlassOverlay>
        <MagnifyingGlassCircle />
        <MagnifyingGlassHandle />
      </MagnifyingGlassOverlay>
      <LobbyText>Looking for an opponent</LobbyText>
      <Menu>
        <MenuOption backgroundColor={COLORS.red}>
          <Link to="/">Exit</Link>
        </MenuOption>
      </Menu>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const MagnifyingGlassOverlay = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(45deg);
`

const MagnifyingGlassCircle = styled.div`
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 10px solid ${COLORS.grey};
  border-radius: 50%;
  border-top-color: ${COLORS.charcoal};
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
`

const MagnifyingGlassHandle = styled.div`
  margin-left: -3px;
  width: 60px;
  height: 12px;
  background: ${COLORS.grey};
  border-top-right-radius: 30%;
  border-bottom-right-radius: 30%;
`
const LobbyText = styled.p`
  font-size: 1.5rem;
`
