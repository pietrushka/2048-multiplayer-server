import { ReactNode } from "react"
import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { ImCross } from "react-icons/im"
import { mediaQueries } from "../styles"

type ModalProps = {
  children: ReactNode
  bgColor?: string
  closeModal?: () => void
}

export default function Modal({ closeModal, bgColor, children }: ModalProps) {
  return (
    <Overlay onClick={closeModal}>
      <PopUp onClick={(e) => e.stopPropagation()} bgColor={bgColor}>
        {closeModal ? (
          <CloseModalButton onClick={closeModal}>
            <ImCross />
          </CloseModalButton>
        ) : null}
        {children}
      </PopUp>
    </Overlay>
  )
}

const appear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

export const Overlay = styled.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
})

export const PopUp = styled.div<{ bgColor?: string }>(({ bgColor }) => ({
  position: "relative",
  background: bgColor ? bgColor : "white",
  borderRadius: "1em",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: "90vw",
  boxSizing: "border-box",
  padding: "1em",
  animation: `${appear} 300ms ease-in-out`,

  [mediaQueries.tabletPortrait]: {
    padding: "1.5em",
  },
}))

const CloseModalButton = styled.button({
  position: "absolute",
  top: 0,
  right: 0,
  margin: "1em",
  padding: 0,
  background: "transparent",
  cursor: "pointer",
})
