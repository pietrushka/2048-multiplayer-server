import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import SingleGame from "./pages/SingleGame"
import MultiGame from "./pages/MultiGame"
import { PlayerProvider } from "./hooks/usePlayer"
import Layout from "./components/Layout"

function App() {
  return (
    <PlayerProvider>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/singleplayer" element={<SingleGame />} />
            <Route path="/multiplayer" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </PlayerProvider>
  )
}

export default App
