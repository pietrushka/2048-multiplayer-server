import { useState } from "react"
import styled from "@emotion/styled"
import { AiOutlineSetting } from "react-icons/ai"
import { ImCross } from "react-icons/im"
import { Overlay, PopUp } from "./GameResult"
import { Menu, MenuOption } from "../pages/Home"
import COLORS from "../styles/colors"

function Settings() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <SettingsButton isVisible={isVisible} onClick={() => setIsVisible(true)}>
        {!isVisible && <AiOutlineSetting />}
      </SettingsButton>
      {isVisible && (
        <Overlay onClick={() => setIsVisible(false)}>
          <PopUp onClick={(e) => e.stopPropagation()}>
            <HideSettingsBtn onClick={() => setIsVisible(false)}>
              <ImCross />
            </HideSettingsBtn>
            <h1>Settings</h1>
            <Menu>
              <MenuOption backgroundColor={COLORS.red} onClick={() => setIsVisible(false)}>
                Go to menu
              </MenuOption>
            </Menu>
          </PopUp>
        </Overlay>
      )}
    </>
  )
}

export default Settings

const HideSettingsBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1.25em;
  height: 1.25rem;
  width: 1.25rem;
  padding: 0;
  color: red;
  background: transparent;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
  @media (min-width: 480px) {
    height: 1.5rem;
    width: 1.5rem;
  }
`

const SettingsButton = styled.button<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.25rem;
  width: 2rem;
  height: 2rem;
  z-index: 100;
  outline: none;
  cursor: pointer;
  background: transparent;

  svg {
    width: 100%;
    height: 100%;
    fill: ${COLORS.font};
  }

  @media (min-width: 480px) {
    width: 2.5rem;
    height: 2.5rem;
  }
`
