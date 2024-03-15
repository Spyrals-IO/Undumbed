export const isString = (value: unknown): value is string => typeof value === 'string'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isNil = (value: unknown): value is undefined | null => value === null || value === undefined
export const isNotNil = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null
export const isError = (value: unknown): value is Error => value instanceof Error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunction = (value: unknown): value is (...params: ReadonlyArray<any>) => unknown => typeof value === 'function'
export const isArray = <T>(value: unknown | ReadonlyArray<T>): value is ReadonlyArray<T> => Array.isArray(value)
export const isDate = (value: unknown): value is Date => value instanceof Date
export const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)
export const isBigInt = (value: unknown): value is BigInt => typeof value === "bigint"
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean"
export const isSymbol = (value: unknown): value is symbol => typeof value === "symbol"
export const isNull = (value: unknown): value is null => value === null
export const isUndefined = (value: unknown): value is undefined => value === undefined