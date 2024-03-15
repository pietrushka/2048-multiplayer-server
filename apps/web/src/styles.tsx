import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { keyframesCss } from "./components/TileGrid/styles"
import COLORS from "./styles/colors"

export const mediaQueries = {
  tabletPortrait: "@media (min-width: 768px) and (orientation: portrait)",
  largeTabletPortrait: "@media (min-width: 1024px) and (orientation: portrait)",
  laptop: "@media (min-width: 1024px) and (orientation: landscape)",
  desktop: "@media (min-width: 1200px)",
  largeScreen: "@media (min-width: 1800px)",
}

export const globalStyles = css`
  ${keyframesCss}
`

export const GameContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  height: "90vh",
  maxWidth: "50vh",
  width: "100%",
})

export const DashboardScore = styled.div({
  textAlign: "center",
  background: COLORS.sand,
  borderRadius: "0.5em",
  h3: {
    fontSize: "1.25rem",
    margin: "0.25em 0",
  },
  p: {
    fontSize: "1.1rem",
    margin: "0.25em 0",
  },
})

export const GameButton = styled.button({
  fontSize: "inherit",
  margin: "0.5em 0",
  padding: "0.75em 1.2em",
  background: COLORS.warmGray,
  color: COLORS.font,
  borderRadius: "0.5em",
  textAlign: "center",

  "h3, h4, span": {
    margin: "0",
  },

  "&[disabled]": {
    filter: "grayscale(1)",
  },
})
