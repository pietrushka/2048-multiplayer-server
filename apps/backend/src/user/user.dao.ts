import sql from "../db/sql"
import { User, UserDB } from "./user.interface"
import { objectToCamel } from "ts-case-convert"

export async function checkIsEmailTaken(email: string): Promise<boolean> {
  const users = await sql<Pick<User, "email">[]>`SELECT email FROM users WHERE email = ${email} LIMIT 1`
  return !!users[0]
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [row] = await sql<UserDB[]>`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return row ? objectToCamel(row) : undefined
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [row] = await sql<UserDB[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return row ? objectToCamel(row) : undefined
}

export async function insertUser(user: User): Promise<void> {
  await sql`
    INSERT INTO users 
    (id, email, nickname, is_active, password,  google_id, total_score)
    VALUES 
    (${user.id}, ${user.email}, ${user.nickname},  ${user.isActive}, ${user.password || null}, ${user.googleId || null}, ${user.totalScore})`
}

export async function updateIsActive({ id, isActive }: { id: string; isActive: boolean }) {
  await sql`UPDATE users SET is_active = ${isActive} WHERE id = ${id}`
}

export async function updatePassword({ id, password }: { id: string; password: string }) {
  await sql`UPDATE users SET password = ${password} WHERE id = ${id}`
}

export async function getUserByGoogleId(googleId: string): Promise<User | undefined> {
  const [row] = await sql<UserDB[]>`SELECT * FROM users WHERE google_id = ${googleId} LIMIT 1`
  return row ? objectToCamel(row) : undefined
}
