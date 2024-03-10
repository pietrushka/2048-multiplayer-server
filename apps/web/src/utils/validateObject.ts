import { TileGrid } from "shared-logic"

type TypeString = "string" | "number" | "numberArrayArray"

export type Schema = Record<string, TypeString>

const isString = (value: unknown): value is string => typeof value === "string"
const isNumber = (value: unknown): value is number => typeof value === "number"
const isNumberArrayArray = (value: unknown): value is TileGrid => {
  if (!Array.isArray(value)) return false
  return value.every((subArray) => Array.isArray(subArray) && subArray.every((element) => typeof element === "number"))
}

export default function validateObject(schema: Schema, item: unknown) {
  return Object.entries(schema).every(([key, type]) => {
    let checker
    switch (type) {
      case "string":
        checker = isString
        break
      case "number":
        checker = isNumber
        break
      case "numberArrayArray":
        checker = isNumberArrayArray
        break
      default:
        checker = () => true
        break
    }

    const value = (item as Record<string, unknown>)[key]
    return checker(value)
  })
}
