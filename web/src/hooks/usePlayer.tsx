import { useState, useEffect, useContext, createContext } from "react"
import { getStoredPlayer, storePlayer } from "../utils/localStorage"

type TPlayerContext = {
  nickname: string
  bestScore: number
  setNickname: (nickname: string) => void
  setBestScore: (bestScore: number) => void
}

const PlayerContext = createContext<TPlayerContext | null>(null)

interface PlayerProviderProps {
  children: React.ReactNode
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [nickname, setNickname] = useState("")
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    const storedPlayer = getStoredPlayer()
    if (storedPlayer) {
      setNickname(storedPlayer.nickname)
      setBestScore(storedPlayer.bestScore)
    }
    setIsInitialized(true)
  }, [setBestScore, setNickname])

  useEffect(() => {
    // avoid overwrite with default values
    if (isInitialized) {
      storePlayer({ nickname, bestScore })
    }
  }, [nickname, bestScore, isInitialized])

  return (
    <PlayerContext.Provider
      value={{
        nickname,
        bestScore,
        setNickname,
        setBestScore,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
