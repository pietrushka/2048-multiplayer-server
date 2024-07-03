export function chunk<T>(array: T[], size: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}

export const deepCopyArray = <T>(array: T[]): T[] => JSON.parse(JSON.stringify(array))

export const sum = (array: number[]) => array.reduce((acc, x) => acc + x, 0)

export function arrayDifferenceLeft<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item))
}

export function addTimeToCurrentTimestamp(ms: number): string {
  const now = new Date()
  const later = new Date(now.getTime() + ms)
  return later.toISOString()
}

export function areArraysEqual(array1: unknown[], array2: unknown[]) {
  return JSON.stringify(array1) === JSON.stringify(array2)
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
