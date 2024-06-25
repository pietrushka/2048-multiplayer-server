import crypto from "crypto"
import bcrypt from "bcrypt"
import * as UserDAO from "./user.dao"

type CreateUserEmail = {
  email: string
  password: string
  nickname: string
}
export async function createUserWithEmail({ email, password, nickname }: CreateUserEmail): Promise<string> {
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

type CreateUserGoogle = {
  email: string
  nickname: string
  googleId: string
}

export async function createUserWithGoogle({ email, nickname, googleId }: CreateUserGoogle): Promise<string> {
  const id = crypto.randomUUID()
  const bestScore = 0
  const isActive = true
  await UserDAO.insertUser({
    id,
    email,
    nickname,
    bestScore,
    isActive,
    googleId,
  })
  return id
}

export async function changeUserPassword({ id, password }: { id: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  await UserDAO.updatePassword({ id, password: hashedPassword })
}
