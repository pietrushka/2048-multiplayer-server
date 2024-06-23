import { objectToCamel } from "ts-case-convert"
import sql from "../db/sql"
import { Token, TokenDB, TokenType } from "./token.interface"

export async function insertToken({ token, userId, type, expireAt }: Token) {
  await sql`
    INSERT INTO tokens 
    (token, user_id, type, expire_at) 
    VALUES (${token}, ${userId}, ${type}, ${expireAt})`
}

type DeleteUserToken = {
  type: TokenType
  userId: string
}
export async function deleteUserTokens({ type, userId }: DeleteUserToken) {
  await sql`DELETE FROM tokens WHERE type = ${type} AND user_id = ${userId}`
}

export async function getTokenRow(token: string): Promise<Token | undefined> {
  const [row] = await sql<TokenDB[]>`
    SELECT * FROM tokens WHERE token = ${token}
  `
  return row ? objectToCamel(row) : undefined
}

export async function deleteToken({ token }: { token: string }) {
  await sql`DELETE FROM tokens WHERE token = ${token}`
}
