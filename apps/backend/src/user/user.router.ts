import { Router } from "express"
import { register, login, getUserData, logout } from "./user.controller"

const router: Router = Router()

router.get("/me", getUserData)

router.post("/logout", logout)

router.post("/register", register)

router.post("/login", login)

export default router
