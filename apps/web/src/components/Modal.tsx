import { ReactNode } from "react"
import styled from "@emotion/styled"
import { ImCross } from "react-icons/im"
import { mediaQueries } from "../styles"

type ModalProps = {
  children: ReactNode
  closeModal?: () => void
}

export default function Modal({ closeModal, children }: ModalProps) {
  function handleCloseModal() {
    closeModal?.()
  }
  return (
    <Overlay onClick={handleCloseModal}>
      <PopUp onClick={(e) => e.stopPropagation()}>
        <CloseModalButton onClick={handleCloseModal}>
          <ImCross />
        </CloseModalButton>
        {children}
      </PopUp>
    </Overlay>
  )
}

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
  backgroundColor: "rgba(0, 0, 0, 0.5)",
})

export const PopUp = styled.div({
  position: "relative",
  background: "white",
  borderRadius: "1em",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: "90vw",
  boxSizing: "border-box",
  padding: "1em",

  [mediaQueries.tabletPortrait]: {
    padding: "1.5em",
  },
})

const CloseModalButton = styled.button({
  position: "absolute",
  top: 0,
  right: 0,
  height: "1.25rem",
  width: "1.25rem",
  margin: "1.25rem",
  background: "transparent",
})
