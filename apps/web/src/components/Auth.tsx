import styled from "@emotion/styled"
import COLORS from "../styles/colors"

export const Form = styled.form({
  border: "1px solid black",
  display: "flex",
  flexDirection: "column",
  gap: "1em",
  padding: "2em",
  paddingBottom: "0",
  textAlign: "center",
})

export const Heading = styled.h1({
  fontSize: "2em",
})

export const Input = styled.input({
  fontSize: "1.5em",
  background: COLORS.warmGray,
  color: COLORS.font,
  borderRadius: "1rem",
  border: "none",
  padding: "0.5em",
  textAlign: "center",
})

export const Button = styled.button({
  borderRadius: "1rem",
  fontSize: "1.5em",
  padding: "0.5em 0",
  background: COLORS.blue,
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
