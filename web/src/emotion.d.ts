import "@emotion/react"

declare module "@emotion/react" {
  export interface Theme {
    gapSize: number
    borderRadius: number
    tileSize: number
  }
}
