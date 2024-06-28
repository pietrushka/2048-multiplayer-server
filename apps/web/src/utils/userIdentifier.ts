// TODO rename to playerIdentifier
import Cookies from "js-cookie"
import { COOKIE_NAMES } from "shared-logic"

export function getUserIdentifier() {
  return Cookies.get(COOKIE_NAMES.PLAYER_IDENTIFIER)
}
export function setUserIdentifier() {
  const existingIdentifier = getUserIdentifier()
  if (!existingIdentifier) {
    const identifier = crypto.randomUUID()
    // TODO add cookie flags
    Cookies.set(COOKIE_NAMES.PLAYER_IDENTIFIER, identifier)
  }
}
