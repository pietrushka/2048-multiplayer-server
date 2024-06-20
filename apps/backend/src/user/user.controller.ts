import { Request, Response } from "express"
import { z } from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import { checkIsEmailTaken, checkIsNicknameTaken, getUserByEmail, getUserById, insertUser } from "../db/user.dao"
import authenticateToken from "../utils/authenticateToken"

export async function getUserData(request: Request, response: Response) {
  const userId = authenticateToken(request, response)
  if (!userId) {
    return
  }

  const user = await getUserById(userId)
  if (!user) {
    return response.status(404).json({ message: "User not found" })
  }

  return response.status(200).json(user)
}

export const registerSchema = z.object({
  body: z.object({
    nickname: z.string().min(1).max(20),
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

export function logout(request: Request, response: Response) {
  response.clearCookie("accessToken")
  return response.status(200).json({ message: "Logged out" })
}

export async function register(request: Request, response: Response) {
  try {
    const { success, data, error } = registerSchema.safeParse(request)
    if (!success) {
      return response.status(400).json({ error })
    }
    const { email, nickname, password } = data.body

    const isEmailTaken = await checkIsEmailTaken(email)
    if (isEmailTaken) {
      return response.status(401).json({ message: "Email already exists" })
    }

    const isNicknameTaken = await checkIsNicknameTaken(email)
    if (isNicknameTaken) {
      return response.status(401).json({ message: "Nickname already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      email,
      nickname,
      password: hashedPassword,
    }
    await insertUser(user)

    return response.status(200).json({ message: "User registered" })
  } catch (error) {
    console.error("error", JSON.stringify(error, null, 2))
    return response.status(400).json({ message: "Server error" })
  }
}

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
})

export async function login(request: Request, response: Response) {
  try {
    const {
      body: { email, password },
    } = loginSchema.parse(request)

    const user = await getUserByEmail(email)
    if (!user) {
      return response.status(401).json({ message: "Invalid email or password" })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return response.status(401).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

    response.setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 3600, // 1 hour
        path: "/",
      }),
    )

    return response.status(200).json({ message: "Logged in" })
  } catch (error) {
    console.log("error", JSON.stringify(error))
    return response.status(400).json({ message: "Server error" })
  }
}
