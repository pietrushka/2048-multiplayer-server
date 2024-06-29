function convertIndexToDirection(index: number): string {
  const vectorKeyToDirectionMap = {
    0: "UP",
    1: "RIGHT",
    2: "DOWN",
    3: "LEFT",
  }
  return vectorKeyToDirectionMap[index as keyof typeof vectorKeyToDirectionMap]
}

export default function simulateMove(): string {
  return convertIndexToDirection(Math.floor(Math.random() * 4))
}
