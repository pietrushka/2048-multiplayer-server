export type UserDB = {
  id: string
  email: string
  nickname: string
  best_score: number
  is_active: boolean
  password?: string
  google_id?: string
}

export type User = {
  id: string
  email: string
  nickname: string
  bestScore: number
  isActive: boolean
  password?: string
  googleId?: string
}
