import { css } from "@emotion/react"
import { keyframesCss } from "./components/TileGrid/styles"

export const mediaQueries = {
  tabletPortrait: "@media (min-width: 768px) and (orientation: portrait)",
  laptop: "@media (min-width: 1024px)",
  //   laptopLarge: "@media (min-width: 1440px)",
  desktop: "@media (min-width: 1200px)",
  largeScreen: "@media (min-width: 1800px)",
}

export const globalStyles = css`
  ${keyframesCss}
`
