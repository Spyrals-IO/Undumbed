declare global {
  interface ObjectConstructor {
    entries<K extends string | number | symbol, V>(obj: Record<K, V>): ReadonlyArray<[K, V]>
  }
}

declare global {
  interface Object {
    entries<K extends string | number | symbol, V>(this: Record<K, V>): ReadonlyArray<[K, V]>
    map<K extends string | number | symbol, V, R>(this: Record<K, V>, f: (k: K, v: V, index: number, obj: Record<K, V>) => R): Record<K, R>
    flatten<K1 extends string | number, K2 extends string | number, V>(this: Record<K1, Record<K2, V>>): Record<`${K1}.${K2}`, V>
  }
}

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
