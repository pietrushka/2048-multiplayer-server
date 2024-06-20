import { Request, Response } from "express"
import jwt from "jsonwebtoken"

interface DecodedToken {
  id: string
}

export default function authenticateToken(req: Request, res: Response): string | undefined {
  try {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
      res.status(401).json({ error: "Invalid token" })
      return
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as DecodedToken
    if (!decodedToken.id) {
      res.status(401).json({ error: "Invalid token" })
      return
    }

    return decodedToken.id
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: "Invalid token" })
  }
}
