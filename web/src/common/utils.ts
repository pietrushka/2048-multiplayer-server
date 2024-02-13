export function chunk<T>(array: T[], size: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}

export const deepCopyArray = (array: unknown[]) => JSON.parse(JSON.stringify(array))

export const sum = (array: number[]) => array.reduce((acc, x) => acc + x, 0)

export function arrayDifferenceLeft<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item))
}
