import { isNotNil } from './type.js'

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
  }
}

/** Functional style */

export const entries = <K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]> => Object.entries(obj) as never

export const map = <K extends string | number | symbol, V, R>(
  obj: Record<K, V>,
  f: (_k: K, _v: V, _index: number, _obj: Record<K, V>) => R
): Record<K, R> => Object.fromEntries(entries(obj).map(([k, v], i, arr) => [k, f(k, v, i, Object.fromEntries(arr) as never)] as const)) as never

export const flatten = <K extends string | number | symbol, V>(obj: Record<K, null | undefined | V>): Record<K, V> =>
  Object.fromEntries(entries(obj).filter((kv): kv is [K, V] => isNotNil(kv[1]))) as never

export const includes = <K extends string | number | symbol, V, K2  extends K, V2 extends V>(self: Record<K, V>, other: Record<K2, V2>): self is Record<K, V> & Record<K2, V2> =>
  Object.entries(other).filter(([k, v]) => self[k as K] !== v).length !== 0

// @ts-expect-error overloading
export function filter<K extends string | number | symbol, V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V>
// @ts-expect-error overloading
export function filter<K extends string | number | symbol, V, R extends V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => v is R): Record<K, R>

// @ts-expect-error overloading
export const filter = <K extends string | number | symbol, V>(self: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, R> =>
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