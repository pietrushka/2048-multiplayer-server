import crypto from "crypto"
import sql from "./sql"

type User = {
  id: number
  email: string
  password: string
  nickname: string
  best_score: number
}

export async function checkIsEmailTaken(email: string): Promise<boolean> {
  const users = await sql<Pick<User, "email">[]>`SELECT email FROM users WHERE email = ${email} LIMIT 1`
  return !!users[0]
}

export async function checkIsNicknameTaken(nickname: string): Promise<boolean> {
  const users = await sql<Pick<User, "nickname">[]>`SELECT email FROM users WHERE nickname = ${nickname} LIMIT 1`
  return !!users[0]
}

type GetUserByEmail = Pick<User, "id" | "email" | "password">
export async function getUserByEmail(email: string): Promise<GetUserByEmail | undefined> {
  const users = await sql<GetUserByEmail[]>`SELECT id,email, password FROM users WHERE email = ${email} LIMIT 1`
  return users[0]
}

type GetUserById = {
  id: User["id"]
  email: User["email"]
  nickname: User["nickname"]
  bestScore: User["best_score"]
}

export async function getUserById(id: string): Promise<GetUserById | undefined> {
  const [user] = await sql`SELECT email, best_score, nickname FROM users WHERE id = ${id} LIMIT 1`
  if (!user) return undefined
  return {
    id: user.id,
    email: user.email,
    bestScore: user.best_score,
    nickname: user.nickname,
  }
}

export async function insertUser(user: Pick<User, "email" | "password" | "nickname">) {
  const id = crypto.randomUUID()
  const best_score = 0
  await sql`INSERT INTO users (id, email, password, nickname, best_score) VALUES (${id}, ${user.email}, ${user.password}, ${user.nickname}, ${best_score})`
}
