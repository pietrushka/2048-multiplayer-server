import crypto from "crypto"
import bcrypt from "bcrypt"
import * as UserDAO from "./user.dao"
import sql from "../db/sql"

type CreateUserEmail = {
  email: string
  password: string
  nickname: string
}
export async function createUserWithEmail({ email, password, nickname }: CreateUserEmail): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()
  const isActive = false
  const totalScore = 0
  await UserDAO.insertUser({
    id,
    email,
    nickname,
    password: hashedPassword,
    isActive,
    credits,
    totalScore,
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
  const isActive = true
  const totalScore = 0
  await UserDAO.insertUser({
    id,
    email,
    nickname,
    isActive,
    googleId,
    credits,
    totalScore,
  })
  return id
}

export async function changeUserPassword({ id, password }: { id: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  await UserDAO.updatePassword({ id, password: hashedPassword })
}

export function addPoints({ userId, earnedPoints }: { userId: string; earnedPoints: number }) {
  const totalPoints = sql`
        UPDATE users
        SET 
            total_score = total_score + ${earnedPoints}
        WHERE id = ${userId}
    `
  return totalPoints
}
