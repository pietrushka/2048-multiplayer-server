import { useState, useEffect } from "react"
import styled from "@emotion/styled"

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourRotation = hours * 30 + minutes * 0.5
  const minuteRotation = minutes * 6
  const secondRotation = seconds * 6

  return (
    <ClockFace>
      <ClockCenter rotation={hourRotation} color="#777" size={15}>
        <Hand length={70} width={6} />
      </ClockCenter>
      <ClockCenter rotation={minuteRotation} color="#555" size={11}>
        <Hand length={80} width={4} />
      </ClockCenter>
      <ClockCenter rotation={secondRotation} color="#333" size={8}>
        <Hand length={90} width={2} />
      </ClockCenter>
    </ClockFace>
  )
}

const ClockFace = styled.div({
  width: 200,
  height: 200,
  border: "4px solid #333",
  borderRadius: "50%",
  position: "relative",
})

const Hand = styled.div<{ length: number; width: number }>(({ width, length }) => ({
  position: "absolute",
  bottom: "50%",
  left: "50%",
  height: length,
  width: width,
  borderRadius: 10,
  backgroundColor: "inherit",
  transform: "translate(-50%, 0)",
}))

const ClockCenter = styled.div<{ rotation: number; color: string; size: number }>(({ rotation, color, size }) => ({
  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
  backgroundColor: color,
  position: "absolute",
  top: "50%",
  left: "50%",
  width: size,
  height: size,
  borderRadius: "50%",
}))
