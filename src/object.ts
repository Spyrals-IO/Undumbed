import { isNotNil, isObject } from './type.js'

declare global {
  interface ObjectConstructor {
    // @ts-expect-error we are surcharging
    entries<K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]>
  }
}

declare global {
  interface Object {
    /**
     * Return the entries of this object, in an array of key-value tuples.
     */
    entries<K extends string | number | symbol, V>(this: Record<K, V>): ReadonlyArray<[K, V]>
    /**
     * Build a new object by applying `f` to each entry of this object.
     */
    map<K extends string | number | symbol, V, R>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => R): Record<K, R>
    /**
     * Refine this object to know if it completly contains another one.
     */
    includes<K extends string | number | symbol, V, K2  extends K, V2 extends V>(this: Record<K, V>, other: Record<K2, V2>): this is Record<K, V> & Record<K2, V2>
    /**
     * Select the properties to keep in a newly created object based on the return of f.
     */
    filter<K extends string | number | symbol, V>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V>
    filter<K extends string | number | symbol, V, R extends V>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => v is R): Record<K, R>
    /**
     * Fold this object into a value.
     */
    reduce<K extends  string | number | symbol, V, R>(this: Record<K, V>, f: (acc: R, k: K, v: V, i: number, obj: this) => R, init: R): R
    flatten<K1 extends string | number | symbol, V>(this: Record<K1, null | undefined | V>): Record<K1, V>
    sequence<K extends string | number | symbol, V>(this: Record<string, Promise<V>>): Promise<Record<K, V>>
    sum<K extends string | number | symbol>(this: Record<K, number>): number
    median<K extends string | number | symbol>(this: Record<K, number>): number
    isEmpty(): boolean
    show<K extends string | number | symbol, V>(this: Record<K, V>, opts?: {separator?: string, start?: string, end?: string, keyValueShow?: (key: K, value: V) => string}): string
    excludes<K extends string | number | symbol>(this: Record<K, unknown>, keys: ReadonlyArray<K>): Record<K, unknown>
    updateAt<K extends string | number | symbol, Key extends K, V, V1>(this: Record<K, V>, key: Key, value: V1): Record<K, V> & Record<Key, V1>
    /**
     * Merge this object with another object. For conflicting keys, values from the second object take precedence.
     */
    merge<K extends string | number | symbol, V, K2 extends string | number | symbol, V2>(this: Record<K, V>, other: Record<K2, V2>): Record<K | K2, V | V2>
    /**
     * Merge this object with another object using a resolver function for conflicting keys.
     */
    mergeWith<K extends string | number | symbol, V, K2 extends string | number | symbol, V2, R>(this: Record<K, V>, other: Record<K2, V2>, resolver: (key: K & K2, value1: V, value2: V2) => R): Record<K | K2, V | V2 | R>
    /**
     * Deep merge this object with another object.
     */
    deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(this: T, other: U): T & U
    /**
     * Create a new object with only the specified keys.
     */
    pick<K extends string | number | symbol, V, Keys extends K>(this: Record<K, V>, keys: ReadonlyArray<Keys>): Record<Keys, V>
    /**
     * Create a new object without the specified keys.
     */
    omit<K extends string | number | symbol, V, Keys extends K>(this: Record<K, V>, keys: ReadonlyArray<Keys>): Record<Exclude<K, Keys>, V>
    /**
     * Get all keys of this object.
     */
    keys<K extends string | number | symbol>(this: Record<K, unknown>): ReadonlyArray<K>
    /**
     * NOTE: values() désactivé car cause un crash V8 (conflit avec Object.values natif)
     * Get all values of this object.
     */
    // values<V>(this: Record<string, V>): ReadonlyArray<V>
    /**
     * Swap keys and values of this object.
     */
    invert<K extends string | number | symbol, V extends string | number | symbol>(this: Record<K, V>): Record<V, K>
    /**
     * Transform all keys of this object using the provided function.
     */
    mapKeys<K extends string | number | symbol, V, K2 extends string | number | symbol>(this: Record<K, V>, f: (key: K, value: V) => K2): Record<K2, V>
  }
}

/** Functional style */

export const entries = <K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]> => Object.entries(obj) as never

export const map = <K extends string | number | symbol, V, R>(
  obj: Record<K, V>,
  f: (_k: K, _v: V, _index: number, _obj: Record<K, V>) => R
): Record<K, R> => Object.fromEntries(entries(obj).map(([k, v], i) => [k, f(k, v, i, obj)] as const)) as never

export const flatten = <K extends string | number | symbol, V>(obj: Record<K, null | undefined | V>): Record<K, V> =>
  Object.fromEntries(entries(obj).filter((kv): kv is [K, V] => isNotNil(kv[1]))) as never

export const includes = <K extends string | number | symbol, V, K2  extends K, V2 extends V>(self: Record<K, V>, other: Record<K2, V2>): self is Record<K, V> & Record<K2, V2> =>
  Object.entries(other).filter(([k, v]) => self[k as K] !== v).length !== 0

// @ts-expect-error overloading
export function filter<K extends string | number | symbol, V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V>
// @ts-expect-error overloading
export function filter<K extends string | number | symbol, V, R extends V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => v is R): Record<K, R>

// @ts-expect-error overloading
export const filter = <K extends string | number | symbol, V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V> =>
  // @ts-ignore
  flatten(map(self, (k, v, i, r) => f(k, v, i, r) ? v : null))

export const reduce = <K extends  string | number | symbol, V, R>(self: Record<K, V>, f: (acc: R, k: K, v: V, i: number, obj: typeof self) => R, init: R): R =>
  Object.entries(self).reduce((acc, [k, v], i) => f(acc, k as K, v as V, i, self), init)

export const sequence = <K extends string | number | symbol, V>(self: Record<string, Promise<V>>): Promise<Record<K, V>> =>
  Promise.all(Object.entries(self).map(([k, pv]) => pv.then((v) => [k, v] as const))).then(Object.fromEntries)

export const sum = <K extends string | number | symbol>(self: Record<K, number>): number => 
  reduce(self, (acc, _k, v) => acc + v, 0)  

export const median = <K extends string | number | symbol>(self: Record<K, number>): number => {
  const sorted = (Object.values(self) as Array<number>).sort((a, b) => a - b)
  return sorted.length % 2 === 0 
  ? sorted[sorted.length / 2]!
  : (sorted[Math.floor(sorted.length)]! + sorted[Math.ceil(sorted.length)]!) / 2
}

export const isEmpty = (self: Record<string, unknown>): boolean =>
  Object.keys(self).length === 0

const defaultShowOpts = {
  separator: ',',
  start: '{',
  end: '}',
  keyValueShow: (k: string | number | symbol, v: unknown) => `${k.toString()}: ${JSON.stringify(v)}`
}
export const show = <K extends string | number | symbol, V>(self: Record<K, V>, opts: {separator?: string, start?: string, end?: string, keyValueShow?: (key: K, value: V) => string} = defaultShowOpts): string => {
  const ops = {...defaultShowOpts, ...opts}

  return reduce(self, (acc, k, v) => `${acc}${ops.keyValueShow(k, v)}${ops.separator}`, ops.start) + ops.end
}

export const excludes = <K extends string | number | symbol>(self: Record<K, unknown>, keys: ReadonlyArray<K>): typeof self =>
  filter(self, (k: K) => !keys.includes(k))

export const updateAt = <K extends string | number | symbol, Key extends K, V, V1>(self: Record<K, V>, key: Key, value: V1): Record<K, V> & Record<Key, V1> => {
  const copy = {...self}
  // @ts-expect-error ts should infer that we are adding a new key but cannot yet
  copy[key] = value
  // @ts-expect-error same as above
  return copy
}

export const merge = <T, U>(self: T, other: U): T & U => 
  ({...self, ...other}) as T & U

export const mergeWith = <T extends Record<string, any>, U extends Record<string, any>, R>(
  self: T, 
  other: U, 
  resolver: (key: Extract<keyof T & keyof U, string>, value1: T[keyof T], value2: U[keyof U]) => R
): T & U => {
  const result = {...self} as any
  for (const [key, value] of Object.entries(other)) {
    if (key in result) {
      result[key] = resolver(key as any, result[key], value)
    } else {
      result[key] = value
    }
  }
  return result as T & U
}

export const deepMerge = <T extends Record<string, unknown>, U extends Record<string, unknown>>(self: T, other: U): T & U => {
  if (!isObject(self) || !isObject(other)) {
    return other as T & U
  }

  const result = {...self}
  for (const [key, value] of Object.entries(other)) {
    if (key in result && isObject(result[key]) && isObject(value)) {
      (result as Record<string, unknown>)[key] = deepMerge(result[key], value)
    } else {
      (result as Record<string, unknown>)[key] = value
    }
  }
  return result as T & U
}

export const pick = <T extends Record<string, unknown>, K extends keyof T>(self: T, keys: ReadonlyArray<K>): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in self) {
      result[key] = self[key]
    }
  }
  return result
}

export const omit = <T, K extends keyof T>(self: T, keys: ReadonlyArray<K>): Omit<T, K> => {
  const keySet = new Set(keys)
  return filter(self as Record<string, unknown>, (k) => !keySet.has(k as K)) as Omit<T, K>
}

export const keys = <T>(self: T): ReadonlyArray<keyof T> => 
  Object.keys(self as Record<string, unknown>) as unknown as ReadonlyArray<keyof T>

export const values = <T>(self: T): ReadonlyArray<T[keyof T]> => 
  Object.values(self as Record<string, unknown>) as ReadonlyArray<T[keyof T]>

export const invert = <K extends string | number | symbol, V extends string | number | symbol>(
  self: Record<K, V>
): Record<V, K> => {
  const result = {} as Record<V, K>
  for (const [key, value] of entries(self)) {
    result[value] = key
  }
  return result
}

export const mapKeys = <T extends Record<string, unknown>, K2 extends string | number | symbol>(
  self: T, 
  f: (key: keyof T, value: T[keyof T]) => K2
): Record<K2, T[keyof T]> => {
  const result = {} as Record<K2, T[keyof T]>
  for (const [key, value] of entries(self as Record<string, unknown>)) {
    const newKey = f(key as keyof T, value as T[keyof T])
    result[newKey] = value as T[keyof T]
  }
  return result
}

/** Object style */

Object.prototype['entries'] = function<K extends string | number | symbol, V>(this: Record<K, V>): ReadonlyArray<[K, V]> {
  return entries(this)
}

Object.prototype['map'] = function<K extends string | number | symbol, V, R>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => R): Record<K, R> {
  return map(this, f)
}

Object.prototype['flatten'] = function<K extends string | number | symbol, V>(this: Record<K, null | undefined | V>): Record<K, V> {
  return flatten(this)
}

// @ts-expect-error declaration is more specific, as it should. 
Object.prototype['includes'] = function<K extends string | number | symbol, V, K2  extends K, V2 extends V>(this: Record<K, V>, other: Record<K2, V2>): boolean {
  return includes(this, other)
}

Object.prototype['filter'] = function<K extends string | number | symbol, V>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V>{
  return filter(this, f)
}

Object.prototype['reduce'] = function<K extends  string | number | symbol, V, R>(this: Record<K, V>, f: (acc: R, k: K, v: V, i: number, obj: Record<K, V>) => R, init: R): R {
  return reduce(this, f, init)
}

Object.prototype['sequence'] = function<K extends string | number | symbol, V>(this: Record<string, Promise<V>>): Promise<Record<K, V>> {
  return sequence(this)
}

Object.prototype['sum'] = function<K extends string | number | symbol>(this: Record<K, number>): number {
  return sum(this)
}

Object.prototype['median'] = function<K extends string | number | symbol>(this: Record<K, number>): number {
  return median(this)
}

Object.prototype['isEmpty'] = function(this: Record<string, unknown>): boolean {
  return isEmpty(this)
}

Object.prototype['show'] = function<K extends string | number | symbol, V>(this: Record<K, V>, opts?: {separator?: string, start?: string, end?: string, keyValueShow?: (key: K, value: V) => string}): string {
  return show(this, opts)
}

Object.prototype['excludes'] = function<K extends string | number | symbol>(this: Record<K, unknown>, keys: ReadonlyArray<K>): Record<K, unknown> {
  return excludes(this, keys)
}

Object.prototype['updateAt'] = function<K extends string | number | symbol, Key extends K, V, V1>(this: Record<K, V>, key: Key, value: V1): Record<K, V> & Record<Key, V1> {
  return updateAt(this, key, value)
}

Object.prototype['merge'] = function<K extends string | number | symbol, V, K2 extends string | number | symbol, V2>(this: Record<K, V>, other: Record<K2, V2>): Record<K | K2, V | V2> {
  return merge(this, other)
}

Object.prototype['mergeWith'] = function<K extends string | number | symbol, V, K2 extends string | number | symbol, V2, R>(this: Record<K, V>, other: Record<K2, V2>, resolver: (key: K & K2, value1: V, value2: V2) => R): Record<K | K2, V | V2 | R> {
  return mergeWith(this, other, resolver)
}

Object.prototype['deepMerge'] = function<T extends Record<string, unknown>, U extends Record<string, unknown>>(this: T, other: U): T & U {
  return deepMerge(this, other)
}

Object.prototype['pick'] = function<K extends string | number | symbol, V, Keys extends K>(this: Record<K, V>, keys: ReadonlyArray<Keys>): Record<Keys, V> {
  return pick(this, keys)
}

Object.prototype['omit'] = function<K extends string | number | symbol, V, Keys extends K>(this: Record<K, V>, keys: ReadonlyArray<Keys>): Record<Exclude<K, Keys>, V> {
  return omit(this, keys)
}

Object.prototype['keys'] = function<K extends string | number | symbol>(this: Record<K, any>): ReadonlyArray<K> {
  return keys(this)
}

// PROBLÉMATIQUE : values cause un crash V8 - probablement conflit avec Object.values natif
/*
Object.prototype['values'] = function<V>(this: Record<any, V>): ReadonlyArray<V> {
  return values(this)
}
*/

Object.prototype['invert'] = function<K extends string | number | symbol, V extends string | number | symbol>(this: Record<K, V>): Record<V, K> {
  return invert(this)
}

Object.prototype['mapKeys'] = function<K extends string | number | symbol, V, K2 extends string | number | symbol>(this: Record<K, V>, f: (key: K, value: V) => K2): Record<K2, V> {
  return mapKeys(this, f)
}
