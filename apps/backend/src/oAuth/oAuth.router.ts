import { Router } from "express"
import * as oAuthController from "./oAuth.controller"

const router: Router = Router() // /oauth

router.get("/google", oAuthController.getGoogleAuthToken)

export default router
