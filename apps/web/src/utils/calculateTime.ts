export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 1) return `${seconds}s`
  if (remainingSeconds < 10) return `${minutes}:0${remainingSeconds}`
  return `${minutes}:${remainingSeconds}`
}

export function calculateRemainingSeconds(isoEndTime: string): number {
  const endTimeMs = new Date(isoEndTime).getTime()
  const currentTimeMs = Date.now()
  const remainingMs = endTimeMs - currentTimeMs
  const remainingSeconds = Math.round(remainingMs / 1000)
  return remainingSeconds
}
