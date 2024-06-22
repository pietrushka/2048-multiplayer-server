export enum TokenType {
  activateAccount = "activateAccount",
}

export type TokenDB = {
  token: string
  userId: string
  type: TokenType
  expire_at: Date
}

export type Token = {
  token: string
  userId: string
  type: TokenType
  expireAt: Date
}
