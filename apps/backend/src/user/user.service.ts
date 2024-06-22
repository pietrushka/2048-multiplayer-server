import crypto from "crypto"
import bcrypt from "bcrypt"
import * as UserDAO from "./user.dao"

type CreateUser = {
  email: string
  password: string
  nickname: string
}
export async function createUser({ email, password, nickname }: CreateUser): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()
  const bestScore = 0
  const isActive = false
  await UserDAO.insertUser({
    id,
    email,
    nickname,
    password: hashedPassword,
    bestScore,
    isActive,
  })
  return id
}
