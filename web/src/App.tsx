import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Global } from "@emotion/react"
import Home from "./pages/Home"
import SingleGame from "./pages/SingleGame"
import MultiGame from "./pages/MultiGame"
import { PlayerProvider } from "./hooks/usePlayer"
import Layout from "./components/Layout"
import { globalStyles } from "./styles"

function App() {
  return (
    <Layout>
      <Global styles={globalStyles} />
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/singleplayer" element={<SingleGame />} />
            <Route path="/multiplayer" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </Layout>
  )
}

export default App
