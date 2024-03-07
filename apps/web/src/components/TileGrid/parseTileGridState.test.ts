import { encodeTileGridState } from "../../common/Board/boardUtils"
import { DIRECTIONS, MOVES } from "../../common/constants"
import { TileGrid } from "../../common/types"
import parseTileGridState from "./parseTileGridState"

test("simple move", () => {
  const previousTileGrid = [
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
  ] as TileGrid
  const currentTileGrid = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
  ] as TileGrid
  const move = MOVES.LEFT

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))

  expect(result).toEqual([
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 0,
        prevXIndex: 3,
        prevYIndex: 0,
        isMerged: false,
        isNew: false,
        id: "0-0-3-0",
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 1,
        prevXIndex: 3,
        prevYIndex: 1,
        isMerged: false,
        isNew: false,
        id: "0-1-3-1",
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 2,
        prevXIndex: 3,
        prevYIndex: 2,
        isMerged: false,
        isNew: false,
        id: "0-2-3-2",
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 3,
        prevXIndex: 3,
        prevYIndex: 3,
        isMerged: false,
        isNew: false,
        id: "0-3-3-3",
        mergedInto: false,
      },
    ],
  ])
})

test("simple move non-left direction", () => {
  const previousTileGrid = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
  ] as TileGrid
  const currentTileGrid = [
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
  ] as TileGrid
  const move = MOVES.RIGHT

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))

  expect(result).toEqual(
    // using arrayContaining because order rotated,
    // it doesn't matter because we use indexes from the object
    expect.arrayContaining([
      [
        {
          value: 2,
          xIndex: 3,
          yIndex: 0,
          prevXIndex: 0,
          prevYIndex: 0,
          isMerged: false,
          id: "3-0-0-0",
          isNew: false,
          mergedInto: false,
        },
      ],
      [
        {
          value: 2,
          xIndex: 3,
          yIndex: 1,
          prevXIndex: 0,
          prevYIndex: 1,
          isMerged: false,
          id: "3-1-0-1",
          isNew: false,
          mergedInto: false,
        },
      ],
      [
        {
          value: 2,
          xIndex: 3,
          yIndex: 2,
          prevXIndex: 0,
          prevYIndex: 2,
          isMerged: false,
          id: "3-2-0-2",
          isNew: false,
          mergedInto: false,
        },
      ],
      [
        {
          value: 2,
          xIndex: 3,
          yIndex: 3,
          prevXIndex: 0,
          prevYIndex: 3,
          isMerged: false,
          id: "3-3-0-3",
          isNew: false,
          mergedInto: false,
        },
      ],
    ])
  )
})

test("differnt kind of moves", () => {
  const previousTileGrid = [
    [4, 0, 0, 2],
    [0, 2, 0, 0],
    [0, 0, 2, 8],
    [8, 4, 2, 4],
  ] as TileGrid
  const currentTileGrid = [
    [4, 2, 0, 0],
    [2, 0, 0, 0],
    [2, 8, 0, 0],
    [8, 4, 2, 4],
  ] as TileGrid
  const move = MOVES.LEFT

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))
  expect(result).toEqual([
    [
      {
        value: 4,
        xIndex: 0,
        yIndex: 0,
        prevXIndex: 0,
        prevYIndex: 0,
        isMerged: false,
        id: "0-0-0-0",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 2,
        xIndex: 1,
        yIndex: 0,
        prevXIndex: 3,
        prevYIndex: 0,
        isMerged: false,
        id: "1-0-3-0",
        isNew: false,
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 1,
        prevXIndex: 1,
        prevYIndex: 1,
        isMerged: false,
        id: "0-1-1-1",
        isNew: false,
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 2,
        prevXIndex: 2,
        prevYIndex: 2,
        isMerged: false,
        id: "0-2-2-2",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 8,
        xIndex: 1,
        yIndex: 2,
        prevXIndex: 3,
        prevYIndex: 2,
        isMerged: false,
        id: "1-2-3-2",
        isNew: false,
        mergedInto: false,
      },
    ],
    [
      {
        value: 8,
        xIndex: 0,
        yIndex: 3,
        prevXIndex: 0,
        prevYIndex: 3,
        isMerged: false,
        id: "0-3-0-3",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 4,
        xIndex: 1,
        yIndex: 3,
        prevXIndex: 1,
        prevYIndex: 3,
        isMerged: false,
        id: "1-3-1-3",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 2,
        xIndex: 2,
        yIndex: 3,
        prevXIndex: 2,
        prevYIndex: 3,
        isMerged: false,
        id: "2-3-2-3",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 4,
        xIndex: 3,
        yIndex: 3,
        prevXIndex: 3,
        prevYIndex: 3,
        isMerged: false,
        id: "3-3-3-3",
        isNew: false,
        mergedInto: false,
      },
    ],
  ])
})

test("find new values after move", () => {
  const previousTileGrid = [
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 2],
  ] as TileGrid
  const currentTileGrid = [
    [2, 0, 0, 0],
    [2, 0, 0, 2],
    [2, 0, 2, 0],
    [2, 2, 0, 0],
  ] as TileGrid
  const move = MOVES.LEFT

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))
  expect(result).toEqual([
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 0,
        prevXIndex: 3,
        prevYIndex: 0,
        isMerged: false,
        id: "0-0-3-0",
        isNew: false,
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 1,
        prevXIndex: 3,
        prevYIndex: 1,
        isMerged: false,
        id: "0-1-3-1",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 2,
        xIndex: 3,
        yIndex: 1,
        prevXIndex: 3,
        prevYIndex: 1,
        isMerged: false,
        id: "3-1-3-1",
        isNew: true,
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 2,
        prevXIndex: 3,
        prevYIndex: 2,
        isMerged: false,
        id: "0-2-3-2",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 2,
        xIndex: 2,
        yIndex: 2,
        prevXIndex: 2,
        prevYIndex: 2,
        isMerged: false,
        id: "2-2-2-2",
        isNew: true,
        mergedInto: false,
      },
    ],
    [
      {
        value: 2,
        xIndex: 0,
        yIndex: 3,
        prevXIndex: 3,
        prevYIndex: 3,
        isMerged: false,
        id: "0-3-3-3",
        isNew: false,
        mergedInto: false,
      },
      {
        value: 2,
        xIndex: 1,
        yIndex: 3,
        prevXIndex: 1,
        prevYIndex: 3,
        isMerged: false,
        id: "1-3-1-3",
        isNew: true,
        mergedInto: false,
      },
    ],
  ])
})

test("merges", () => {
  const previousTileGrid = [
    [4, 0, 4, 4],
    [4, 0, 4, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ] as TileGrid
  const currentTileGrid = [
    [8, 4, 0, 0],
    [8, 4, 4, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ] as TileGrid
  const move = DIRECTIONS.LEFT

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))
  expect(result[0]).toEqual([
    {
      value: 8,
      xIndex: 0,
      yIndex: 0,
      prevXIndex: 0,
      prevYIndex: 0,
      isMerged: false,
      id: "0-0-0-0",
      isNew: false,
      mergedInto: true,
    },
    {
      value: 4,
      xIndex: 0,
      yIndex: 0,
      prevXIndex: 2,
      prevYIndex: 0,
      isMerged: true,
      id: "0-0-2-0",
      isNew: false,
      mergedInto: false,
    },
    {
      value: 4,
      xIndex: 1,
      yIndex: 0,
      prevXIndex: 3,
      prevYIndex: 0,
      isMerged: false,
      id: "1-0-3-0",
      isNew: false,
      mergedInto: false,
    },
  ])
  expect(result[1]).toEqual([
    {
      value: 8,
      xIndex: 0,
      yIndex: 1,
      prevXIndex: 0,
      prevYIndex: 1,
      isMerged: false,
      id: "0-1-0-1",
      isNew: false,
      mergedInto: true,
    },
    {
      value: 4,
      xIndex: 0,
      yIndex: 1,
      prevXIndex: 2,
      prevYIndex: 1,
      isMerged: true,
      id: "0-1-2-1",
      isNew: false,
      mergedInto: false,
    },
    {
      value: 4,
      xIndex: 1,
      yIndex: 1,
      prevXIndex: 3,
      prevYIndex: 1,
      isMerged: false,
      id: "1-1-3-1",
      isNew: false,
      mergedInto: false,
    },
    {
      value: 4,
      xIndex: 2,
      yIndex: 1,
      prevXIndex: 2,
      prevYIndex: 1,
      isMerged: false,
      id: "2-1-2-1",
      isNew: true,
      mergedInto: false,
    },
  ])
})

// TODO fix test name
test("xd", () => {
  const previousTileGrid = [
    [0, 0, 0, 2],
    [0, 0, 0, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ] as TileGrid
  const currentTileGrid = [
    [0, 0, 0, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 4],
  ] as TileGrid
  const move = DIRECTIONS.DOWN

  const result = parseTileGridState(encodeTileGridState(currentTileGrid, move), encodeTileGridState(previousTileGrid))
  expect(result).toEqual([
    [
      {
        value: 2,
        xIndex: 3,
        yIndex: 0,
        prevXIndex: 3,
        prevYIndex: 0,
        isMerged: false,
        id: "3-0-3-0",
        isNew: true,
        mergedInto: false,
      },
    ],
    [],
    [],
    [
      {
        value: 4,
        xIndex: 3,
        yIndex: 3,
        prevXIndex: 3,
        prevYIndex: 1,
        isMerged: false,
        id: "3-3-3-1",
        isNew: false,
        mergedInto: true,
      },
      {
        value: 2,
        xIndex: 3,
        yIndex: 3,
        prevXIndex: 3,
        prevYIndex: 0,
        isMerged: true,
        id: "3-3-3-0",
        isNew: false,
        mergedInto: false,
      },
    ],
  ])
})

// test.skip("the same values moving on the same axis will be merged", () => {}
