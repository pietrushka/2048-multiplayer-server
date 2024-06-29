import crypto from "crypto"
import bcrypt from "bcrypt"
import { insertUser } from "../user/user.dao"

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password", 10)
  // Generate 20 mock users
  for (let i = 0; i < 20; i++) {
    const id = crypto.randomUUID()
    const email = `user${i + 1}@example.com`
    const nickname = `User${i + 1}`
    const totalScore = i * 1000
    const isActive = true
    const password = hashedPassword

    await insertUser({
      id,
      email,
      nickname,
      totalScore,
      isActive,
      password,
    })
  }
}
