import sql from "../db/sql"
import { User, UserDB } from "./user.interface"
import { objectToCamel } from "ts-case-convert"

export async function checkIsEmailTaken(email: string): Promise<boolean> {
  const users = await sql<Pick<User, "email">[]>`SELECT email FROM users WHERE email = ${email} LIMIT 1`
  return !!users[0]
}

export async function checkIsNicknameTaken(nickname: string): Promise<boolean> {
  const users = await sql<Pick<User, "nickname">[]>`SELECT email FROM users WHERE nickname = ${nickname} LIMIT 1`
  return !!users[0]
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [row] = await sql<UserDB[]>`SELECT id,email, password FROM users WHERE email = ${email} LIMIT 1`
  return row ? objectToCamel(row) : undefined
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [row] = await sql<UserDB[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return row ? objectToCamel(row) : undefined
}

export async function insertUser(user: User): Promise<void> {
  await sql`
    INSERT INTO users (id, email, password, nickname, best_score, is_active) 
    VALUES (${user.id}, ${user.email}, ${user.password}, ${user.nickname}, ${user.bestScore}, ${user.isActive})`
}

export async function updateIsActive({ id, isActive }: { id: string; isActive: boolean }) {
  await sql`UPDATE users SET is_active = ${isActive} WHERE id = ${id}`
}
