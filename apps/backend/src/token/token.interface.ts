export enum TokenType {
  activateAccount = "activateAccount",
  resetPassword = "resetPassword",
}

export type TokenDB = {
  token: string
  userId: string
  type: TokenType
  expire_at: string
}

export type Token = {
  token: string
  userId: string
  type: TokenType
  expireAt: string
}
