import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import COLORS from "../styles/colors"

export default function LoadingAnimation() {
  return (
    <LoadingContainer>
      <Dot />
      <Dot />
      <Dot />
    </LoadingContainer>
  )
}

const dotAnimation = keyframes`
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`

const LoadingContainer = styled.div({
  display: "inline-flex",
  alignItems: "center",
})

const Dot = styled.span({
  fontSize: "1rem",
  width: "1em",
  height: "1em",
  margin: "0 4px",
  borderRadius: 2,
  backgroundColor: COLORS.board,
  display: "inline-block",
  animation: `${dotAnimation} 2s infinite ease-in-out both`,

  "&:nth-of-type(1)": {
    animationDelay: "-0.32s",
  },

  "&:nth-of-type(2)": {
    animationDelay: "-0.16s",
  },
})
