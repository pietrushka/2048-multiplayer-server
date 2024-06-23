import styled from "@emotion/styled"
import COLORS from "../../styles/colors"

export const Form = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: "0.75em",
  paddingBottom: "0",
  textAlign: "center",
  padding: "1.25em",
})

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

export const Button = styled.button({
  borderRadius: "0.15em",
  fontSize: "1.5em",
  padding: "0.5em 0",
  background: COLORS.board,
  color: COLORS.lightFont,
  cursor: "pointer",
})

export const Error = styled.p({
  display: "block",
  height: "1em",
  color: COLORS.red,
  padding: ".5em",
  margin: 0,
})

export const InputGroup = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: ".25em",
})
