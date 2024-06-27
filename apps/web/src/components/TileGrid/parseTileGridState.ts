// TODO refactor

import {
  TileGrid,
  TileValue,
  Direction,
  decodeTileGridState,
  rotateBoardLeft,
  areArraysEqual,
  deepCopyArray,
  OPERATIONS,
} from "shared-logic"
import rotateCoordinateLeft from "../../utils/rotateCoordinatesLeft"

export interface TileAnimationData {
  value: TileValue
  xIndex: number
  yIndex: number
  prevXIndex: number
  prevYIndex: number
  isMerged: boolean
  mergedInto: boolean
  isNew: boolean

  id?: string
}

class Tile implements TileAnimationData {
  value: TileValue
  xIndex: number
  yIndex: number
  prevXIndex: number
  prevYIndex: number
  isMerged: boolean
  mergedInto: boolean
  isNew: boolean
  isRotatedLeft: boolean

  constructor({
    value,
    xIndex,
    yIndex,
    prevXIndex,
    prevYIndex,
    isRotatedLeft,
    isNew = false,
  }: {
    value: TileValue
    xIndex: number
    yIndex: number
    prevXIndex: number
    prevYIndex: number
    isRotatedLeft: boolean
    isNew?: boolean
  }) {
    // tiles can overlap so use prevIndexes as well
    this.value = value
    this.xIndex = xIndex
    this.yIndex = yIndex
    this.prevXIndex = prevXIndex
    this.prevYIndex = prevYIndex
    this.isMerged = false
    this.mergedInto = false
    this.isNew = isNew
    this.isRotatedLeft = isRotatedLeft
  }

  get data(): Required<TileAnimationData> {
    return {
      id: `${this.xIndex}-${this.yIndex}-${this.prevXIndex}-${this.prevYIndex}`,
      value: this.value,
      xIndex: this.xIndex,
      yIndex: this.yIndex,
      prevXIndex: this.prevXIndex,
      prevYIndex: this.prevYIndex,
      isMerged: this.isMerged,
      mergedInto: this.mergedInto,
      isNew: this.isNew,
    }
  }

  rotateCoordinatesBack(direction: Direction) {
    ;[this.xIndex, this.yIndex] = rotateCoordinateLeft([this.xIndex, this.yIndex], direction, 4, true)
    ;[this.prevXIndex, this.prevYIndex] = rotateCoordinateLeft([this.prevXIndex, this.prevYIndex], direction, 4, true)
    this.isRotatedLeft = false
  }
}

function analyzePreviousGrid(previousTileGrid?: TileGrid, direction?: Direction): TileAnimationData[] {
  if (!previousTileGrid || !direction) {
    return []
  }

  const previousTileGridRotated = rotateBoardLeft(deepCopyArray(previousTileGrid), direction)

  const gridSize = 4
  const result: TileAnimationData[][] = []
  previousTileGridRotated.forEach((oldRow, prevYIndex) => {
    const rowResult: TileAnimationData[] = []

    oldRow.forEach((oldValue, prevXIndex) => {
      if (oldValue === 0) {
        const tile = new Tile({
          value: oldValue,
          xIndex: prevXIndex,
          yIndex: prevYIndex,
          prevXIndex,
          prevYIndex,
          isRotatedLeft: true,
        })
        tile.rotateCoordinatesBack(direction)
        rowResult.push(tile.data)
        return
      }

      // prepare new xIndex and yIndex
      const yIndex = prevYIndex
      let xIndex = prevXIndex
      for (let checkXPosition = prevXIndex - 1; checkXPosition >= 0; checkXPosition--) {
        // empty tile
        if (oldRow[checkXPosition] === 0) {
          xIndex -= 1
          continue
        }
        if (
          // tile to merge
          oldRow[checkXPosition] === oldValue &&
          // only 0s in between
          !oldRow.slice(checkXPosition + 1, prevXIndex).filter((x) => x !== 0).length
        ) {
          xIndex -= 1
          continue
        }

        // tile which will disappear
        if (rowResult[checkXPosition].isMerged) {
          xIndex -= 1
          continue
        }
      }

      const tile = new Tile({
        value: oldValue,
        xIndex,
        yIndex,
        prevXIndex,
        prevYIndex,
        isRotatedLeft: true,
      })

      // set isMerged
      for (let checkXPosition = prevXIndex - 1; checkXPosition >= 0; checkXPosition--) {
        if (rowResult[checkXPosition].isMerged) {
          break
        }
        if (
          // tile to merge
          oldRow[checkXPosition] === oldValue &&
          // only 0s in between
          !oldRow.slice(checkXPosition + 1, prevXIndex).filter((x) => x !== 0).length
        ) {
          tile.isMerged = true
          break
        }
      }

      // update value
      if (!tile.isMerged) {
        for (let checkXPosition = prevXIndex + 1; checkXPosition < gridSize; checkXPosition++) {
          if (oldRow[checkXPosition] === 0) continue
          if (oldRow[checkXPosition] !== oldValue) break
          tile.value += oldRow[checkXPosition]
          tile.mergedInto = true
          break
        }
      }

      tile.rotateCoordinatesBack(direction)
      rowResult.push(tile.data)
    })

    result.push(rowResult.filter((x) => x.value !== 0))
  })

  // TODO maybe rotate the board???
  // return rotateBoardLeft(result, direction, true)
  return result.flat()
}

// TODO refactor
function validateWithCurrentState(previousGridResult: TileAnimationData[], currentTileGrid: TileGrid) {
  const result: TileAnimationData[][] = []
  // no need for currentTileGrid to be rotated
  currentTileGrid.forEach((row, yIndex) => {
    const rowResult: TileAnimationData[] = []
    row.forEach((value, xIndex) => {
      const tiles = previousGridResult.filter((el) => el.xIndex === xIndex && el.yIndex === yIndex)

      // add new tile
      if (value && !tiles.length) {
        const tile = new Tile({
          value,
          xIndex,
          yIndex,
          prevXIndex: xIndex,
          prevYIndex: yIndex,
          isRotatedLeft: false,
        })
        tile.isNew = true
        rowResult.push(tile.data)
        return
      }

      rowResult.push(...tiles)
    })
    result.push(rowResult)
  })
  return result
}

export default function parseTileGridState(currentTileGridStateEncoded: string, previousTileGridStateEncoded?: string) {
  const { tileGrid: currentTileGrid, previousMove: move } = decodeTileGridState(currentTileGridStateEncoded)

  const { tileGrid: previousTileGrid } =
    typeof previousTileGridStateEncoded === "string"
      ? decodeTileGridState(previousTileGridStateEncoded)
      : { tileGrid: undefined }

  if (move === OPERATIONS.RESET) {
    return currentTileGrid.map((row, yIndex) =>
      row.map((value, xIndex) => {
        const tile = new Tile({
          value,
          xIndex,
          yIndex,
          prevXIndex: xIndex,
          prevYIndex: yIndex,
          isRotatedLeft: false,
        })
        return tile.data
      }),
    )
  }

  // TODO remove this
  if (previousTileGrid && areArraysEqual(currentTileGrid, previousTileGrid)) {
    return currentTileGrid.map((row, yIndex) =>
      row.map((value, xIndex) => {
        const tile = new Tile({
          value,
          xIndex,
          yIndex,
          prevXIndex: xIndex,
          prevYIndex: yIndex,
          isRotatedLeft: false,
        })
        return tile.data
      }),
    )
  }
  const previousGridResult = analyzePreviousGrid(previousTileGrid, move)

  return validateWithCurrentState(previousGridResult, currentTileGrid)
}
