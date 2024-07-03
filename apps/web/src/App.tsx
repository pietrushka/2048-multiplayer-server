import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Global } from "@emotion/react"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import SingleGame from "./pages/SingleGame"
import MultiGame from "./pages/MultiGame"
import { AuthProvider } from "./contexts/AuthContext"
import { setPlayerIdentifier } from "./utils/playerIdentifierUtils"
import { globalStyles } from "./styles"

function App() {
  useEffect(() => {
    setPlayerIdentifier()
  }, [])

  return (
    <Layout>
      <Global styles={globalStyles} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Navigate to="/" replace />} />

            <Route path="/" element={<Home />} />
            <Route path="/singleplayer" element={<SingleGame />} />
            <Route path="/multiplayer/:type" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Layout>
  )
}

export default App
