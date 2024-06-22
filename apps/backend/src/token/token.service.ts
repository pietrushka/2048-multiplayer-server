import * as crypto from "crypto"
import * as tokenDAO from "./token.dao"
import { TokenType } from "./token.interface"
import EmailService from "../email/sendEmail"

type CreateToken = {
  userId: string
  type: TokenType
  timeToExpire: number
}

async function createToken({ userId, type, timeToExpire }: CreateToken): Promise<string> {
  const token = crypto.randomBytes(16).toString("hex")
  const expireAt = new Date()
  expireAt.setTime(expireAt.getTime() + timeToExpire)

  await tokenDAO.insertToken({ token, userId, expireAt, type })

  return token
}

export async function createAndSendAccountActivationToken({ userId, email }: { userId: string; email: string }) {
  await tokenDAO.deleteUserToken({ userId, type: TokenType.activateAccount })
  const activationToken = await createToken({
    userId,
    type: TokenType.activateAccount,
    timeToExpire: 12 * 60 * 60 * 1000, // 12 hours
  })

  const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`
  await EmailService.sendAccountActivationEmail({ to: email, activationUrl: activationUrl })
}

type ValidationResult =
  | {
      isValid: true
      userId: string
    }
  | {
      isValid: false
      errorMessage: string
    }

export async function validateToken({ token }: { token: string }): Promise<ValidationResult> {
  try {
    const tokenRow = await tokenDAO.getTokenRow(token)
    if (!tokenRow) {
      return { isValid: false, errorMessage: "Token not found" }
    }

    if (new Date(tokenRow.expireAt) < new Date()) {
      return { isValid: false, errorMessage: "Token has expired" }
    }

    return { isValid: true, userId: tokenRow.userId }
  } catch (error) {
    console.error("Error validating token", error)
    return { isValid: false, errorMessage: "Token not found" }
  }
}
