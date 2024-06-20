import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Global } from "@emotion/react"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import SingleGame from "./pages/SingleGame"
import MultiGame from "./pages/MultiGame"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { PlayerProvider } from "./contexts/PlayerContext"
import { AuthProvider } from "./contexts/AuthContext"
import { setUserIdentifier } from "./utils/userIdentifier"
import { globalStyles } from "./styles"

function App() {
  useEffect(() => {
    setUserIdentifier()
  }, [])

  return (
    <Layout>
      <Global styles={globalStyles} />
      <AuthProvider>
        <PlayerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/singleplayer" element={<SingleGame />} />
              <Route path="/multiplayer" element={<MultiGame />} />
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </AuthProvider>
    </Layout>
  )
}

export default App
