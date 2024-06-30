// TODO rename to playerIdentifier
import Cookies from "js-cookie"
import { COOKIE_NAMES } from "shared-logic"

export function gePlayerIdentifier() {
  return Cookies.get(COOKIE_NAMES.PLAYER_IDENTIFIER)
}
export function setPlayerIdentifier() {
  const existingIdentifier = gePlayerIdentifier()
  if (!existingIdentifier) {
    const identifier = crypto.randomUUID()
    // TODO add cookie flags
    Cookies.set(COOKIE_NAMES.PLAYER_IDENTIFIER, identifier)
  }
}
