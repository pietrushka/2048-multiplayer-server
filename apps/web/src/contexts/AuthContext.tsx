import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"

const initialState = {
  isAuthenticated: false,
  user: undefined,
  logout: () => {},
}

type User = {
  id: string
  email: string
  nickname: string
  bestScore: number
}

type TAuthContext = {
  isAuthenticated: boolean
  user: User | undefined
  logout: () => void
}

const AuthContext = createContext<TAuthContext>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const isAuthenticated = !!user

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/me`, {
        method: "GET",
        credentials: "include",
      })

      if (res.status === 200) {
        setUser(await res.json())
        return
      }
      setUser(undefined)
    }
    fetchUser()
  }, [])

  async function logout() {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    })
    setUser(undefined)
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
