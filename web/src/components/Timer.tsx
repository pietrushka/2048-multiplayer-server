import { useState } from "react"
import {
  calculateRemainingSeconds,
  formatDuration,
} from "../utils/calculateTime"
import { useInterval } from "../hooks/useInterval"

type TimerProps = {
  endTimestamp: string
}

export default function Timer({ endTimestamp }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>()

  useInterval(() => {
    setRemainingSeconds(calculateRemainingSeconds(endTimestamp))
  }, 1000)

  if (typeof remainingSeconds !== "number") {
    return <p>-</p>
  }

  return <p>{formatDuration(remainingSeconds)}</p>
}
