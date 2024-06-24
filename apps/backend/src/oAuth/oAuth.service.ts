import axios from "axios"

type GoogleTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  id_token: string
}

export async function getGoogleAuthTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<GoogleTokenResponse> {
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  }
  const result = await axios({
    url: "https://oauth2.googleapis.com/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams(values).toString(),
  })

  return result.data as GoogleTokenResponse
}
