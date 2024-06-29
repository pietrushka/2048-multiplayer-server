import styled from "@emotion/styled"
import COLORS from "../styles/colors"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <View>
      <LayoutContainer>{children}</LayoutContainer>
    </View>
  )
}

const View = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
  background: COLORS.background,
  color: COLORS.font,
  position: "relative",
  overflow: "hidden",
})

const LayoutContainer = styled.div({
  width: "100%",
  padding: "0 10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})
