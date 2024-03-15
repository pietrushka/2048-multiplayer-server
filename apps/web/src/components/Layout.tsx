import styled from "@emotion/styled"
import Settings from "./Settings"
import COLORS from "../styles/colors"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <View>
      <Settings />
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
})

const LayoutContainer = styled.div({
  width: "100%",
  padding: "0 10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})
