import styled from "@emotion/styled"
import Settings from "./Settings"

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

const View = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

const LayoutContainer = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`
