// TODO refactor

import { TileGrid, TileValue, Direction } from "../../common/types"
import { rotateBoardLeft } from "../../common/Board/boardUtils"
import rotateCoordinateLeft from "../../utils/rotateCoordinatesLeft"
import { areArraysEqual, deepCopyArray } from "../../common/utils"

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

  constructor(
    value: TileValue,
    xIndex: number,
    yIndex: number,
    prevXIndex: number,
    prevYIndex: number,
    isRotatedLeft: boolean
  ) {
    // tiles can overlap so use prevIndexes as well
    this.value = value
    this.xIndex = xIndex
    this.yIndex = yIndex
    this.prevXIndex = prevXIndex
    this.prevYIndex = prevYIndex
    this.isMerged = false
    this.mergedInto = false
    this.isNew = false
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

function analyzePreviousGrid(previousTileGrid?: TileGrid, direction?: Direction) {
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
        const tile = new Tile(oldValue, prevXIndex, prevYIndex, prevXIndex, prevYIndex, true)
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

      const tile = new Tile(oldValue, xIndex, yIndex, prevXIndex, prevYIndex, true)

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
function validateWithCurrentState(
  previousGridResult: TileAnimationData[],
  currentTileGrid: TileGrid,
  previousTileGrid?: TileGrid
) {
  const result: TileAnimationData[][] = []
  // no need for currentTileGrid to be rotated
  currentTileGrid.forEach((row, yIndex) => {
    const rowResult: TileAnimationData[] = []
    row.forEach((value, xIndex) => {
      const tiles = previousGridResult.filter((el) => el.xIndex === xIndex && el.yIndex === yIndex)

      // FOR DEV PURPOSE
      if (value && tiles.length && tiles.find((el) => !el.isMerged)?.value !== value) {
        console.log({ value, xIndex, yIndex, tiles, previousGridResult, currentTileGrid, previousTileGrid })
        throw new Error("Value doesn't match")
      }
      if (!value && tiles.length) {
        console.log({ value, xIndex, yIndex, tiles, previousGridResult, currentTileGrid, previousTileGrid })
        throw new Error("There is a previousGridResult but current grid value is 0")
      }

      // add new tile
      if (value && !tiles.length) {
        const tile = new Tile(value, xIndex, yIndex, xIndex, yIndex, false)
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

export default function parseTileGridState(
  currentTileGridString: string,
  previousTileGridString?: string,
  direction?: Direction
) {
  const currentTileGrid = JSON.parse(currentTileGridString) as TileGrid
  const previousTileGrid =
    typeof previousTileGridString === "string" ? (JSON.parse(previousTileGridString) as TileGrid) : undefined
  // TODO remove this
  if (previousTileGrid && areArraysEqual(currentTileGrid, previousTileGrid)) {
    return currentTileGrid.map((row, yIndex) =>
      row.map((value, xIndex) => {
        const tile = new Tile(value, xIndex, yIndex, xIndex, yIndex, false)
        return tile.data
      })
    )
  }
  const previousGridResult = analyzePreviousGrid(previousTileGrid, direction)

  return validateWithCurrentState(previousGridResult, currentTileGrid, previousTileGrid)
}
