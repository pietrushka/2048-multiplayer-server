import { Router } from "express"
import * as userController from "./user.controller"

const router: Router = Router()

router.get("/me", userController.getUserData)

router.post("/logout", userController.logout)

router.post("/register", userController.register)

router.post("/login", userController.login)

router.post("/activate/:token", userController.activateAccount)

export default router
