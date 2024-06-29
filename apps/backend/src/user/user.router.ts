import { Router } from "express"
import * as userController from "./user.controller"

const router: Router = Router()

router.get("/me", userController.getUserData)

router.post("/logout", userController.logout)

router.post("/register", userController.register)

router.post("/login", userController.login)

router.post("/activate/:token", userController.activateAccount)

router.post("/forgot-password/:email", userController.forgotPassword)

router.post("/reset-password/:token", userController.resetPassword)

router.get("/leaderboard", userController.getLeaderboard)

export default router
