import { useState } from "react"
import styled from "@emotion/styled"
import Modal from "../Modal"
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { Button } from "./AuthCommon"
import { useAuth } from "../../contexts/AuthContext"

const authFormMap = {
  register: RegisterForm,
  login: LoginForm,
}

type ActiveFromKey = keyof typeof authFormMap | undefined

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const [activeFormKey, setActiveFormKey] = useState<ActiveFromKey>()

  function closeModal() {
    setActiveFormKey(undefined)
  }

  return (
    <>
      <NavbarContainer>
        {isAuthenticated ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <>
            <Button onClick={() => setActiveFormKey("register")}>Register</Button>
            <Button onClick={() => setActiveFormKey("login")}>Login</Button>
            <AuthModal activeFormKey={activeFormKey} closeModal={closeModal} />
          </>
        )}
      </NavbarContainer>
    </>
  )
}

type AuthModalProps = {
  activeFormKey: ActiveFromKey
  closeModal: () => void
}

function AuthModal({ activeFormKey, closeModal }: AuthModalProps) {
  if (!activeFormKey) return null

  const ActiveForm = authFormMap[activeFormKey]
  return (
    <Modal closeModal={closeModal}>
      <ActiveForm />
    </Modal>
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
  gap: "0.5em",
  boxSizing: "border-box",
  width: "100vw",
})
