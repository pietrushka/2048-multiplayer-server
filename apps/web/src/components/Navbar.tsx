import styled from "@emotion/styled"
import { useAuth } from "../contexts/AuthContext"
import useAuthFormParam from "../hooks/useAuthFormParam"
import { Button } from "./Common"
import { keyframes } from "@emotion/react"

export default function Navbar({ shouldAnimate }: { shouldAnimate: boolean }) {
  const { isAuthenticated, logout } = useAuth()
  const { setActiveFormKey } = useAuthFormParam()

  if (!isAuthenticated) {
    return (
      <NavbarContainer shouldAnimate={shouldAnimate}>
        <Button onClick={() => setActiveFormKey("register")}>Register</Button>
        <Button onClick={() => setActiveFormKey("login")}>Login</Button>
      </NavbarContainer>
    )
  }

  return (
    <NavbarContainer shouldAnimate={shouldAnimate}>
      <Button onClick={logout}>Logout</Button>
    </NavbarContainer>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const NavbarContainer = styled.div<{ shouldAnimate: boolean }>(({ shouldAnimate }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: "0.5em",
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  gap: "1em",
  width: "100vw",
  boxSizing: "border-box",
  ...(shouldAnimate
    ? {
        opacity: 0,
        animation: `${fadeIn} 300ms forwards`,
        animationDelay: "1200ms",
      }
    : {}),
}))
