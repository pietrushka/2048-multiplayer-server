import { createContext, useContext, useEffect, useState } from "react"

const initialState = {
  isAuthenticated: false,
  user: undefined,
  logout: () => {},
  fetchUser: () => {},
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
  fetchUser: () => void
}

const AuthContext = createContext<TAuthContext>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const isAuthenticated = !!user

  useEffect(() => {
    fetchUser()
  }, [])

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

  async function logout() {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    })
    setUser(undefined)
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, logout, fetchUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
