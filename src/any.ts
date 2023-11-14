import { isArray } from "./type"
import { isEmpty as isEmptyArray } from "./array"

export const isEmpty = (value: unknown): boolean => {
  if(isArray(value)) return isEmptyArray(value)
  else if (isString(value)) return isEmptyString(value)
  else if (isDate(value)) return isEmptyDate(value)
  else if (isObject(value)) return isEmptyObject(value)
  else if (isBigInt(value) || isNumber(value)) return isEmptyNumber(value)
  else if (isBoolean(value)) return isEmptyBoolean(value)
  else if (isSymbol(value)) return false
  else if (isNil(value)) return true

  throw new Error(`Unsupported emptiness test on value ${value}`)
}

export const isNotEmpty = negate(isEmpty)

export const areEquals = (value1: unknown, value2: unknown): boolean =>
  typeof value1 === typeof value2 &&
  (value1 === value2 ||
    (isObject(value1) &&
    isObject(value2) &&
    !isNull(value1) &&
    !isNull(value2) &&
    !isUndefined(value1) &&
    !isUndefined(value2) &&
    value1.entries().some(([key1, value2]) => !isUndefined(value2.entries().find(([key2, value2]) => key1 === key2 && areEquals(value1, value2))))
    )
  )