import type { RequestHandler } from "express"

export const adminAuth: RequestHandler = (req, res, next) => {
  const { password } = req.headers

  if (password && password === process.env.ADMIN_SECRET_PASSWORD) {
    next()
  } else {
    res.status(401).send("Authentication failed: wrong password")
  }
}
