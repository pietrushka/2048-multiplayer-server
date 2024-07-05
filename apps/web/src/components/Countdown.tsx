import { useState, useEffect } from "react"
import styled from "@emotion/styled"

type CountdownProps = {
  initialCount: number
  onCountdownEnd: () => void
}

export default function Countdown({ initialCount, onCountdownEnd }: CountdownProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onCountdownEnd()
    }
  }, [count, onCountdownEnd])

  return (
    <CountdownContainer>{count > 1 ? <Message>{count - 1}</Message> : <Message>Let's go!</Message>}</CountdownContainer>
  )
}

const CountdownContainer = styled.div({
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const Message = styled.div({
  fontSize: "1.5em",
  marginTop: "1em",
})
