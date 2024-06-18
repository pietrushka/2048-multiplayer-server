import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Global } from "@emotion/react"
import Home from "./pages/Home"
import SingleGame from "./pages/SingleGame"
import MultiGame from "./pages/MultiGame"
import { PlayerProvider } from "./contexts/PlayerContext"
import Layout from "./components/Layout"
import { setUserIdentifier } from "./utils/userIdentifier"
import { globalStyles } from "./styles"

function App() {
  useEffect(() => {
    // TODO use server generated jwt tokens - is client - client possible?
    // TODO maybe move this to backend - on handshake
    setUserIdentifier()
    console.log(process.env.REACT_APP_SERVER_URL)
  }, [])

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
