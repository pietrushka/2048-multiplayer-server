// TODO not sure if this is the best choice
import styled from "@emotion/styled"
import { useTheme } from "@emotion/react"
import COLORS from "../../styles/colors"

export default function Background() {
  const { borderRadius } = useTheme()
  return (
    <>
      {Array.from({ length: 4 }, () => Array(4).fill(0)).flatMap((row, yIndex) =>
        row.map((_, xIndex) => <Cell key={`${xIndex}-${yIndex}`} borderRadius={borderRadius} />),
      )}
    </>
  )
}

const Cell = styled.div<{ borderRadius: number }>`
  background: ${COLORS.boardCell};
  border-radius: ${({ borderRadius }) => borderRadius}px;
`
