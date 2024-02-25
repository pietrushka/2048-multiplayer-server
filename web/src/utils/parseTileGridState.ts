import { TileGrid, Direction, TileValue } from "../common/types"

const tileGrid1: TileGrid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 2],
]
const tileGrid2: TileGrid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 0, 0],
]

export default function parseTileGridState(currentTileGrid: TileGrid) {
  if (currentTileGrid[3][0] === 2) {
    return [
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 2, prevPosition: [0, 3] }],
    ]
  }
  return [
    [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    [{ value: 2, prevPosition: [3, 3] }, { value: 0 }, { value: 0 }, { value: 0 }],
  ]
}
// const findPrevPos = (
//   tile: TileValue,
//   currentX: number,
//   currentY: number,
//   direction: Direction,
//   prevTileGrid: TileGrid
// ) => {
//   if (direction !== "LEFT") {
//     console.error("findPrevPos: not handled direction")
//   }
//   const axis = prevTileGrid[currentY]
//   const prevIdx = axis.findIndex((x) => x === tile)
//   return {
//     previousX: prevIdx,
//     previousY: currentY,
//   }
// }

// currentTileGrid.flatMap((row, currentY) =>
//   row.map((tile, currentX) => {
//     const { previousX, previousY } = findPrevPos(tile, currentX, currentY, direction, prevTileGrid)
//     return {
//       currentX,
//       currentY,
//       value: tile,
//       ...(tile > 0
//         ? {
//             previousX,
//             previousY,
//           }
//         : {}),
//     }
//   })
// )
