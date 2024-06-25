import { Request, Response } from "express"
import axios from "axios"
import jwt from "jsonwebtoken"
import * as oAuthService from "./oAuth.service"
import * as UserService from "../user/user.service"
import * as UserDAO from "../user/user.dao"
import config from "../config"
import constants from "../constants"

type GoogleUser = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export async function getGoogleAuthToken(request: Request, response: Response) {
  try {
    const code = request.query.code as string
    const { id_token, access_token } = await oAuthService.getGoogleAuthTokens({
      code,
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      redirectUri: `${config.SERVER_URL}/oauth/google`,
    })

    const result = await axios({
      url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
    const googleUser = result.data as GoogleUser

    const existingUser = await UserDAO.getUserByGoogleId(googleUser.id)

    let userId: string
    if (!existingUser) {
      userId = await UserService.createUserWithGoogle({
        email: googleUser.email,
        nickname: googleUser.name,
        googleId: googleUser.id,
      })
    } else {
      userId = existingUser.id
    }

    const token = jwt.sign({ id: userId }, config.JWT_SECRET)

    response.cookie(constants.AUTH_COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    })

    return response.redirect(config.FRONTEND_URL)
  } catch (error) {
    response.status(500).send("Error")
  }
}
