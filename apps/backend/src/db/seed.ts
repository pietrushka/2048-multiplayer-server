import crypto from "crypto"
import bcrypt from "bcrypt"
import { insertUser } from "../user/user.dao"

const nicknames = [
  "blaze",
  "shadowRider7",
  "orion",
  "luna Hawk",
  "ember",
  "titan",
  "warden",
  "apex",
  "zephyr",
  "n0va",
  "griffin",
  "tempest",
  "solarsystem",
  "frost1",
  "Arcane",
  "specter",
  "Phoenix",
  "thunder",
  "Valkyrie",
  "mystic",
]

const totalScores = [
  12550, 5850, 1800, 9550, 6700, 18650, 9200, 5550, 8250, 12650, 13200, 16150, 19800, 5850, 1350, 15500, 17850, 18600,
  8550, 19900,
]

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password", 10)
  // Generate 20 mock users
  for (let i = 0; i < 20; i++) {
    const id = crypto.randomUUID()
    const email = `user${i + 1}@example.com`
    const nickname = nicknames[i]
    const totalScore = totalScores[i]
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
