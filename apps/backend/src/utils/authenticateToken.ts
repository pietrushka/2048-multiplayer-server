import jwt from "jsonwebtoken"

interface DecodedToken {
  id: string
}

type AuthenticateTokenResult =
  | { isValid: true; userId: string; statusCode?: undefined; message?: undefined }
  | { isValid: false; userId?: undefined; statusCode: number; message: string }

export default function authenticateToken(accessToken: string | undefined): AuthenticateTokenResult {
  try {
    if (!accessToken) {
      return {
        isValid: false,
        statusCode: 401,
        message: "Invalid token",
      }
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as DecodedToken
    if (!decodedToken.id) {
      return {
        isValid: false,
        statusCode: 401,
        message: "Invalid token",
      }
    }

    return {
      isValid: true,
      userId: decodedToken.id,
    }
  } catch (error) {
    console.error(error)
    return {
      isValid: false,
      statusCode: 401,
      message: "Invalid token",
    }
  }
}
