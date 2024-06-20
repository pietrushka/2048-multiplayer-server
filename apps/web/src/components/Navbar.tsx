import styled from "@emotion/styled"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <NavbarContainer>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </NavbarContainer>
    )
  }

  return (
    <NavbarContainer>
      <button onClick={logout}>Logout</button>
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
})
