// TODO camelcase types

export type UserDB = {
  id: string
  email: string
  nickname: string
  is_active: boolean
  total_score: number
  password?: string
  google_id?: string
}

export type User = {
  id: string
  email: string
  nickname: string
  isActive: boolean
  totalScore: number
  password?: string
  googleId?: string
}
