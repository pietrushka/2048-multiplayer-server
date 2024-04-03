import type { RequestHandler } from "express"

export const adminAuth: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers
  const token = authorization?.split(" ").at(1)

  if (token && token === process.env.ADMIN_SECRET_PASSWORD) {
    next()
  } else {
    res.status(401)
  }
}
