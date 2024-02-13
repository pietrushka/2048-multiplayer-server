import { calculateRemainingSeconds, formatDuration } from "./calculateTime"

test("formatDuration", () => {
  expect(formatDuration(126)).toBe("2:06")
})

test("calculateRemainingSeconds", () => {
  const fiveMinutesFromNow = new Date(Date.now() + 300000).toISOString()
  expect(calculateRemainingSeconds(fiveMinutesFromNow)).toBe("5:00")
})
