// TODO refactor usePlayer
import React, { useEffect, useContext, createContext, useCallback } from "react"
import { useImmer } from "use-immer"
import { getStoredPlayer, storePlayer } from "../utils/localStorage"

export interface PlayerContextInterface extends PlayerInterface {
  setNickname: (nickname: string) => void
  setBestScore: (bestScore: number) => void
}

const PlayerContext = createContext({} as PlayerContextInterface)

export interface PlayerInterface {
  nickname: string
  bestScore: number
}

interface PlayerProviderProps {
  children: React.ReactNode
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [player, updatePlayer] = useImmer<PlayerInterface>({
    nickname: "",
    bestScore: 0,
  })

  const setNickname = useCallback(
    (nickname: string) => {
      updatePlayer((draft) => {
        draft.nickname = nickname
      })
    },
    [updatePlayer]
  )
  const setBestScore = useCallback(
    (bestScore: number) => {
      updatePlayer((draft) => {
        draft.bestScore = bestScore
      })
    },
    [updatePlayer]
  )

  useEffect(() => {
    const storedPlayer = getStoredPlayer()
    if (storedPlayer) {
      setNickname(storedPlayer.nickname)
      setBestScore(storedPlayer.bestScore)
    }
  }, [setBestScore, setNickname])

  useEffect(() => {
    storePlayer({ nickname: player.nickname, bestScore: player.bestScore })
  }, [player.nickname, player.bestScore])

  return (
    <PlayerContext.Provider
      value={{
        nickname: player.nickname,
        bestScore: player.bestScore,
        setNickname,
        setBestScore,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
