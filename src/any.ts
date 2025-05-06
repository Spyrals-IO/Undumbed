import { isArray, isBigInt, isBoolean, isDate, isNil, isNull, isNumber, isObject, isString, isSymbol, isUndefined } from "./type.js"
import { isEmpty as isEmptyArray } from "./array.js"
import { negate } from "./functions.js"
import "./object.js"

/**
 * Emptiness is type specific and type is check beforehand.
 */
export const isEmpty = (value: unknown): boolean => {
  if(isArray(value)) return isEmptyArray(value)
  else if (isString(value)) return value === ''
  else if (isDate(value)) return value.getTime() === 0
  else if (isObject(value)) return Object.keys(value).length === 0
  else if (isBigInt(value) || isNumber(value)) return value === 0
  else if (isBoolean(value)) return value === false
  else if (isSymbol(value)) return false
  else if (isNil(value)) return true

  throw new Error(`Unsupported emptiness test on value ${value}`)
}

export const isNotEmpty = negate(isEmpty)

/**
 * Deep equality
 */
export const areEquals = (value1: unknown, value2: unknown): boolean =>
  typeof value1 === typeof value2 &&
  (value1 === value2 ||
    arrayEquals(value1, value2) ||
    objectEquals(value1, value2)
  )

const arrayEquals = (value1: unknown, value2: unknown) => 
  Array.isArray(value1) && Array.isArray(value2) &&
  value1.length === value2.length &&
  value1.every((e1, i1) => areEquals(e1, value2[i1]))

const objectEquals = (value1: unknown, value2: unknown) => 
  isObject(value1) &&
  isObject(value2) &&
  !isNull(value1) &&
  !isNull(value2) &&
  !isUndefined(value1) &&
  !isUndefined(value2) &&
    (
      (Object.entries(value1).length !== 0 || Object.entries(value2).length !== 0) &&
      Object.entries(value1).every(([key1, value1]) => {
        return key1 in value2 && areEquals(value1, value2[key1]);
      }) &&
      Object.entries(value2).every(([key2, _]) => {
        return key2 in value1;
      })
    )