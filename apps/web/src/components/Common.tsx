import styled from "@emotion/styled"
import COLORS from "../styles/colors"
import { css, CSSObject } from "@emotion/react"
import { mediaQueries } from "../styles"

const modalContentStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "1.5em",
  paddingBottom: "0",
  textAlign: "center",
  padding: "1.25em",
})

export const ModalContentWrapper = styled.div(modalContentStyles)
export const Form = styled.form(modalContentStyles)

export const Heading = styled.h1({
  fontSize: "2.5em",
})

export const Input = styled.input({
  background: COLORS.warmGray,
  color: COLORS.font,
  border: `3px solid ${COLORS.board}`,
  fontSize: "1.5em",
  boxSizing: "border-box",
  padding: "0.4em 0.4em",
  fontWeight: 500,
  borderRadius: "0.15em",
})

export const buttonStyles: CSSObject = {
  borderRadius: "0.15em",
  fontSize: "1.5rem",
  padding: "0.5em 0.75em",
  background: COLORS.board,
  color: COLORS.lightFont,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5em",
  width: "100%",
  boxSizing: "border-box",

  [mediaQueries.laptop]: {
    fontSize: "1.2rem",
  },
  [mediaQueries.largeScreen]: {
    fontSize: "1.5rem",
  },
}

export const Button = styled.button(buttonStyles)
export const ButtonLikeLink = styled.a(buttonStyles)

export const Error = styled.p({
  display: "block",
  height: "1em",
  color: COLORS.red,
  padding: 0,
  margin: 0,
})

export const InputGroup = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: ".25em",
})

export const Text = styled.p({
  fontSize: "1.25em",
  color: COLORS.font,
  padding: 0,
  margin: 0,
})
