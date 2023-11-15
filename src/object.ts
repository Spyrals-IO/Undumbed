declare global {
  interface ObjectConstructor {
    entries<K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]>
  }
}

declare global {
  interface Object {
    entries<K extends string | number | symbol, V>(this: Record<K, V>): ReadonlyArray<[K, V]>
    map<K extends string | number | symbol, V, R>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => R): Record<K, R>
    // TODO
    includes<K extends string | number | symbol, V, K2  extends string | number | symbol, V2>(this: Record<K, V>, other: Record<K2, V2>): this is Record<K, V> & Record<K2, V2>
    filter<K extends string | number | symbol, V>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => boolean): Record<K, V>
    filter<K extends string | number | symbol, V, R extends V>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => v is R): Record<K, R>
    flatten<K1 extends string | number, V>(this: Record<K1, V | null | undefined | V>): Record<K1, V>
    sequence<K extends string | number | symbol, V>(this: Record<string, Promise<V>>): Promise<Record<K, V>>
    sum<K extends string | number | symbol>(this: Record<K, number>): number
    median<K extends string | number | symbol>(this: Record<K, number>): number
    isEmpty(): boolean
    show<K extends string | number | symbol, V>(this: Record<K, V>, opts: {separator?: string, start?: string, end?: string, keyValueShow?: (key: K, value: V) => string}): string
    excludes<K extends string | number | symbol>(this: Record<K, unknown>, keys: ReadonlyArray<K>)
    updateAt<K extends string | number | symbol, Key extends K, V, V1>(this: Record<K, V>, key: Key, value: V1): Record<K, V> & Record<Key, V1>
  }
}

const obj = {a: 1} as const
const tmp = obj.flatten()

/** Functional style */

export const entries = <K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]> => Object.entries(obj) as never

export const map = <K extends string | number | symbol, V, R>(
  obj: Record<K, V>,
  f: (_k: K, _v: V, _index: number, _obj: Record<K, V>) => R
): Record<K, R> => Object.fromEntries(entries(obj).map(([k, v], i, arr) => [k, f(k, v, i, Object.fromEntries(arr) as never)] as const)) as never

export const flatten = <K1 extends string | number, K2 extends string | number, V>(obj: Record<K1, Record<K2, V>>): Record<`${K1}.${K2}`, V> =>
  Object.fromEntries(entries(obj).flatMap(([k1, v1]) => entries(v1).map(([k2, v]) => [`${k1}.${k2}`, v])))

/** Object style */

Object.prototype['entries'] = function<K extends string | number | symbol, V>(this: Record<K, V>): ReadonlyArray<[K, V]> {
  return entries(this)
}

Object.prototype['map'] = function<K extends string | number | symbol, V, R>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => R): Record<K, R> {
  return map(this, f)
}

Object.prototype['flatten'] = function<K1 extends string | number, K2 extends string | number, V>(this: Record<K1, Record<K2, V>>): Record<`${K1}.${K2}`, V> {
  return flatten(this)
}
