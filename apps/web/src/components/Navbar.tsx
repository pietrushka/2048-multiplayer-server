import styled from "@emotion/styled"
import { useAuth } from "../contexts/AuthContext"
import useAuthFormParam from "./AuthModal/useAuthFormParam"
import { Button } from "./Common"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { setActiveFormKey } = useAuthFormParam()

  if (!isAuthenticated) {
    return (
      <NavbarContainer>
        <Button onClick={() => setActiveFormKey("register")}>Register</Button>
        <Button onClick={() => setActiveFormKey("login")}>Login</Button>
      </NavbarContainer>
    )
  }

  return (
    <NavbarContainer>
      <Button onClick={logout}>Logout</Button>
    </NavbarContainer>
  )
}

const NavbarContainer = styled.div({
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
})
