// TODO make responsive
import { useState } from "react"
import styled from "@emotion/styled"
import { AiOutlineSetting } from "react-icons/ai"
import COLORS from "../styles/colors"
import StyledLink, { LinkList } from "./StyledLink"
import Modal from "./Modal"
import { mediaQueries } from "../styles"

function Settings() {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <>
      <SettingsButton isVisible={isVisible} onClick={() => setIsVisible(true)}>
        {!isVisible && <AiOutlineSetting />}
      </SettingsButton>
      {isVisible && (
        <Modal header="Settings" setIsVisible={setIsVisible}>
          <LinkList>
            <StyledLink bgColor="red" href="/" onClick={() => setIsVisible(false)}>
              Go to menu
            </StyledLink>
          </LinkList>
        </Modal>
      )}
    </>
  )
}

export default Settings

const SettingsButton = styled.button<{ isVisible: boolean }>({
  position: "absolute",
  top: 0,
  left: 0,
  padding: "0.25rem",
  width: "2rem",
  height: "2rem",
  zIndex: 100,
  outline: "none",
  cursor: "pointer",
  background: "transparent",

  svg: {
    width: "100%",
    height: "100%",
    fill: COLORS.font,
  },
  [mediaQueries.tabletPortrait]: {
    width: "2.5rem",
    height: "2.5rem",
  },
})
