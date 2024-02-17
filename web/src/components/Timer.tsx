import { useState, useEffect } from "react"
import { calculateRemainingSeconds, formatDuration } from "../utils/calculateTime"
import { useInterval } from "../hooks/useInterval"

type TimerProps = {
  endTimestamp: string
}

export default function Timer({ endTimestamp }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>()

  useEffect(() => {
    setRemainingSeconds(calculateRemainingSeconds(endTimestamp))
  }, [endTimestamp])

  useInterval(
    () => {
      setRemainingSeconds(calculateRemainingSeconds(endTimestamp))
    },
    remainingSeconds && remainingSeconds >= 1 ? 1000 : null
  )

  if (typeof remainingSeconds !== "number" || remainingSeconds < 1) {
    return <p>-</p>
  }

  return <p>{formatDuration(remainingSeconds)}</p>
}
