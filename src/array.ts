import { areEquals } from './any.js'
import { identity } from './functions.js'
import { isArray, isFunction, isNotNil } from './type.js'

declare global {
  interface ReadonlyArray<T> {
    /**
     * Split the array into multiple equivalently sized new arrays.
     * 
     * @returns
     *  - If size isn't a strictly positive value, returns [this]
     *  - If size > this.length size is assumed to be equal to length
     */
    chunk(size: number): ReadonlyArray<ReadonlyArray<T>>
    /**
     * @returns the last element, if any
     */
    last(): T | undefined
    /**
     * @returns the computed sum of this array
     */
    sum(this: ReadonlyArray<number>): number
    /**
     * Create a new array of tuples made of each elements of this array and the provided one, in order.
     * 
     * @returns if the provided array is bigger than this one, the remaining elements are ignored
     */
    zip<T1>(array: ReadonlyArray<T1>): ReadonlyArray<[T, T1]>;
    /**
     * @returns A new array of tuples, made of the values of this array and their index
     */
    zipWithIndex(): ReadonlyArray<[T, number]>;
    /**
     * @returns a tuple of two arrays containing the separated values of this one.
     */
    unzip<A, B>(this: ReadonlyArray<[A, B]>): [ReadonlyArray<A>, ReadonlyArray<B>];
    /**
     * @returns true if the array has a length of 0
     */
    isEmpty(): boolean
    /**
     * Create a copy of this array without elements which had the same key.
     * If no key is provided, will compare elements of the array by value.
     * 
     * @example
     * ```ts
     * const animals = [{animal: 'cat', size: 10}, {animal: 'cat', size: 20}, {animal: 'dog', size: 100}]
     * const neverMultipleSameAnimale = animals.distinct('animal')
     * // [{animal: 'cat', size: 10}, {animal: 'dog', size: 100}]
     * ```
     * @returns an array of the first values (in order) found for the key, if provided.
     */
    distinct<T extends Record<string, unknown>>(this: ReadonlyArray<T>, key: keyof T): ReadonlyArray<T>
    /**
     * Transform this array into a string.
     * 
     * @argument opts the options on how to display that array.
     * @argument opts.separator the string used in between the elements. Default to ",".
     * @argument opts.start the string to put at the start of the output. Default to "{".
     * @argument opts.end the string to put at the end of the output. Default to "}"
     */
    show(this: ReadonlyArray<string | number>, opts: { separator: string, start?: string, end?: string }): string
    /**
     * Return a copy of this array with elements of `toExcludes` removed.
     * @argument comparator How two elements should be compare, needs to return true when the element are considered equals.
     * 
     * Default comparator is a simple ===.
     * 
     */
    excludes(toExcludes: ReadonlyArray<T>, comparator?: (v1: T, v2: T) => boolean): ReadonlyArray<T>
    /**
     * Create a copy of this array, with the value at `index` changed to `newValue`.
     */
    updateAt(array: ReadonlyArray<T>, index: number, newValue: T | ((value: T) => T)): ReadonlyArray<T>
    /**
     * Return a copy of this array, with the provided element(s) appended at the end.
     */
    append(value: T | ReadonlyArray<T>): ReadonlyArray<T>
    /**
     * Return a random value of this array, of none if the array was empty.
     */
    pick(): T | undefined
    /**
     * Create a copy of this array, with the provided elements added at the start of the array.
     */
    prepend(value: T | ReadonlyArray<T>): ReadonlyArray<T>
    /**
     * Return a new array without duplicated elements. Compared using ===
     * 
     * const catNames = ['miaous', 'milo', 'leo', 'sylvester','miaous']
     * const uniqCatNames = catNames.uniq()
     * // ['miaous', 'milo', 'leo', 'sylvester']
     */
    uniq(): ReadonlyArray<T>
    /**
     * Return a new array without duplicated elements, using the provided comparator to test for equality.
     */
    uniqFor(comparator: (e1: T, e2: T) => boolean): ReadonlyArray<T>
    /**
     * Return a new array without duplicated elements. Duplication is based on having the same value for the provided `key`.
     */
    uniqBy<T extends Record<string, unknown>>(this: ReadonlyArray<T>, key: keyof T): ReadonlyArray<T>
    /**
     * Create a copy of this array containing groups of this one's elements.
     * The groups have been split on the value of the field `key`.
     * 
     * @example
     * ```ts
     * const animals = [{species: 'cat', size: 10}, {species: 'cat', size: 20}, {species: 'dog', size: 100}]
     * const bySpecies = animals.groupBy('species')
     * // [[{species: 'cat', size: 10}, {species: 'cat', size: 20}], [{species: 'dog', size: 100}]]
     * ```
     */
    groupBy<T extends Record<string, unknown>>(this: ReadonlyArray<T>, key: keyof T): ReadonlyArray<ReadonlyArray<T>>
    /**
     * Return a copy of this array containing `length` element from the start of this one.
     */
    take(length: number): ReadonlyArray<T>
    /**
     * Return a copy of this array containing `length` element from the end of this one.
     */
    takeRight(length: number): ReadonlyArray<T>
    /**
     * Create a new array of tuples appairring each value of this array to every and each value of the provided one.
     */
    cartesianProduct<T2>(arr2: ReadonlyArray<T2>): ReadonlyArray<[T, T2]>
    /**
     * Return a new copy of this array with the element randomly re-ordered
     */
    shuffle(): ReadonlyArray<T>
    /**
     * Return the median of this array's values
     */
    median(this: ReadonlyArray<number>): number
    /**
     * Return a new array without empty values and with the inners array inlined.
     */
    flatten(this: ReadonlyArray<ReadonlyArray<T> | undefined | null | T>): ReadonlyArray<T>
    /**
     * Transform many promise into a single one.
     */
    sequence(this: ReadonlyArray<Promise<T>>): Promise<ReadonlyArray<T>>
  }
}
/** Functional style */

export const range = <T = number>(
  length: number,
  filler?: (_index: number) => T
): ReadonlyArray<T> => Array.from({ length }).map((_, i) => (filler || identity)(i as never))

export const chunk = <T>(arr: ReadonlyArray<T>, size: number): ReadonlyArray<ReadonlyArray<T>> =>
  size > 0
    ? range(Math.ceil(arr.length / Math.min(size, arr.length))).map((chunkNo) =>
        arr.slice(chunkNo * size, chunkNo * size + size)
      )
    : [arr]

export const last = <T>(arr: ReadonlyArray<T>): T | undefined => arr[arr.length - 1]

export const sum = (arr: ReadonlyArray<number>): number => arr.reduce((acc, n) => acc + n, 0)

export const zipWithIndex = <T>(arr: ReadonlyArray<T>): ReadonlyArray<[T, number]> =>
  arr.map((t, i) => [t, i])

export const unzip = <A, B>(arr: ReadonlyArray<[A, B]>): [ReadonlyArray<A>, ReadonlyArray<B>] =>
  [arr.map(([a]) => a), arr.map(([,b]) => b)]

export const isEmpty = <T>(arr: ReadonlyArray<T>): arr is [T, ...ReadonlyArray<T>] => arr.length === 0;

export const distinct = <T>(arr: ReadonlyArray<T>, key?: T extends object ? keyof T : undefined): ReadonlyArray<T> => {
  if(key === undefined)
    return [...new Set(arr)]
  else
    return arr.filter((element, index) => arr.findIndex((e, i) => index !== i && areEquals(element[key], e[key])) === index)
}

export const show = (arr: ReadonlyArray<string | number>, opts: { separator: string, start: string, end: string} = {separator: ',', start: '[', end: ']'}): string =>
  arr.reduce((acc, e) => acc + e.toString() + opts.separator , opts.start) + opts.end

export const zip = <T1, T2>(arr1: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> =>
  arr1.flatMap((e1, index) => index in arr2 ? [[e1, arr2[index]!]] : [] as ReadonlyArray<[T1, T2]>)

const defaultComparator = <T>(v1: T, v2: T): boolean => v1 === v2
export const excludes = <T>(arr: ReadonlyArray<T>, toExcludes: ReadonlyArray<T>, comparator: (v1: T, v2: T) => boolean = defaultComparator): ReadonlyArray<T> =>
  arr.filter(e1 => !toExcludes.find(e2 => comparator(e1, e2)))

export const updateAt = <T>(array: ReadonlyArray<T>, objectIndex: number, newValue: T | ((value: T) => T)): ReadonlyArray<T> => 
  array.map((item, index) => index === objectIndex ? isFunction(newValue) ? newValue(item) : newValue : item)

export const append = <T>(array: ReadonlyArray<T>, value: T | ReadonlyArray<T>): ReadonlyArray<T> => 
  [...array, ...(!isArray(value) ? [value] : value) ]

export const pick = <T>(array: ReadonlyArray<T>): T | undefined =>
  array[Math.floor(Math.random() * array.length)]

export const prepend = <T>(array: ReadonlyArray<T>, value: T | ReadonlyArray<T>): ReadonlyArray<T> => 
  [...(!isArray(value) ? [value] : value), ...array]

export const uniq = <T>(array: ReadonlyArray<T>): ReadonlyArray<T> =>
  array.filter((element, index, arr) => arr.indexOf(element) === index)

export const uniqFor = <T>(array: ReadonlyArray<T>, comparator: (e1: T, e2: T) => boolean) =>
  array.filter((element, index, arr) => arr.findIndex((other) => comparator(element, other)) === index)

export const uniqBy = <K extends string | number | symbol, T extends Record<K, unknown>>(array: ReadonlyArray<T>, key: K): ReadonlyArray<T> =>
  uniqFor(array, (e1, e2) => e1[key] === e2[key])

export const take = <T>(array: ReadonlyArray<T>,length: number): ReadonlyArray<T> =>
  array.slice(0, length)

export const takeRight = <T>(array: ReadonlyArray<T>, length: number): ReadonlyArray<T> =>
  array.slice(-length)

export const cartesianProduct = <T1, T2>(arr1: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> =>
  arr1.flatMap(value1 => arr2.map(value2 => [value1, value2] as [T1, T2]))

export const shuffle = <T>(arr: ReadonlyArray<T>): ReadonlyArray<T> => {
  const newArray = [...arr]
  for(let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = newArray[i]!
    newArray[i] = newArray[j]!
    newArray[j] = tmp
  }
  return newArray
}

export const median = (arr: ReadonlyArray<number>): number => {
  if (arr.length === 0) { return 0 }

  const mid = Math.floor(arr.length / 2)
  const nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid]! : (nums[mid - 1]! + nums[mid]!) / 2
};

export const flatten = <T>(array: ReadonlyArray<ReadonlyArray<T> | null | undefined | T>): ReadonlyArray <T> => 
  array.filter(isNotNil).flatMap(t => isArray(t) ? t : [t])

export const sequence = <T>(array: ReadonlyArray<Promise<T>>): Promise<ReadonlyArray<T>> => Promise.all(array)

export const groupBy = <T extends Record<string, unknown>>(self: ReadonlyArray<T>, key: keyof T): ReadonlyArray<ReadonlyArray<T>> =>
  self.reduce((acc, v) => {
    const value = v[key]
    const groupIndex = acc.findIndex((group) => group[0]![key] === value)
    acc[groupIndex]!.push(v)
    return acc
  }, [] as Array<Array<T>> )

/** Object style */

// @ts-ignore
Array.prototype['chunk'] = function<T>(this: ReadonlyArray<T>, size: number): ReadonlyArray<ReadonlyArray<T>> {
  return chunk(this, size)
}

// @ts-ignore
Array.prototype['last'] = function<T>(this: ReadonlyArray<T>): T | undefined {
  return last(this)
}

// @ts-ignore
Array.prototype['sum'] = function(this: ReadonlyArray<number>): number {
  return sum(this)
} as never // conflict with object

// @ts-ignore
Array.prototype['zipWithIndex'] = function<T>(this: ReadonlyArray<T>): ReadonlyArray<[T, number]> {
  return zipWithIndex(this)
}

// @ts-ignore
Array.prototype['unzip'] = function<A, B>(this: ReadonlyArray<[A, B]>): [ReadonlyArray<A>, ReadonlyArray<B>] {
  return unzip(this)
}

// @ts-ignore
Array.prototype['isEmpty'] = function<T>(this: ReadonlyArray<T>): boolean {
  return isEmpty(this)
}

// @ts-ignore
Array.prototype['distinct'] = function<T>(this: ReadonlyArray<T>, key?: T extends object ? keyof T : undefined): ReadonlyArray<T> {
  return distinct(this, key)
}

// @ts-ignore
Array.prototype['show'] = function(this: ReadonlyArray<string | number>, opts: { separator: string, start: string, end: string } = { separator: ',', start: '[', end: ']'}): string {
  return show(this, opts)
} as never // conflict with object

// @ts-ignore
Array.prototype['zip'] = function<T1, T2>(this: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> {
  return zip(this, arr2)
}

// @ts-ignore
Array.prototype['excludes'] = function<T>(this: ReadonlyArray<T>, toExcludes: ReadonlyArray<T>, comparator: (v1: T, v2: T) => boolean = defaultComparator): ReadonlyArray<T> {
  return excludes(this, toExcludes, comparator)
} as never // conflict with object

// @ts-ignore
Array.prototype['updateAt'] = function<T>(this: ReadonlyArray<T>, objectIndex: number, newValue: T | ((value: T) => T)): ReadonlyArray<T> {
  return updateAt(this, objectIndex, newValue)
} as never // conflict with object

// @ts-ignore
Array.prototype['pick'] = function<T>(this: ReadonlyArray<T>): T | undefined {
  return pick(this)
}

// @ts-ignore
Array.prototype['prepend'] = function<T>(this: ReadonlyArray<T>, value: T | ReadonlyArray<T>): ReadonlyArray<T> {
  return prepend(this, value)
}

// @ts-ignore
Array.prototype['uniq'] = function<T>(this: ReadonlyArray<T>): ReadonlyArray<T> {
  return uniq(this)
}

// @ts-ignore
Array.prototype['uniqFor'] = function<T>(this: ReadonlyArray<T>, comparator: (e1: T, e2: T) => boolean): ReadonlyArray<T> {
  return uniqFor(this, comparator)
}

// @ts-ignore
Array.prototype['uniqBy'] = function<K extends string | number | symbol, T extends Record<K, unknown>>(this: ReadonlyArray<T>, key: K): ReadonlyArray<T> {
  return uniqBy(this, key)
}

// @ts-ignore
Array.prototype['take'] = function<T>(this: ReadonlyArray<T>,length: number): ReadonlyArray<T> {
  return take(this, length)
}

// @ts-ignore
Array.prototype['takeRight'] = function<T>(this: ReadonlyArray<T>,length: number): ReadonlyArray<T> {
  return takeRight(this, length)
}

// @ts-ignore
Array.prototype['cartesianProduct'] = function<T1, T2>(this: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> {
  return cartesianProduct(this, arr2)
}

// @ts-ignore
Array.prototype['shuffle'] = function<T>(this: ReadonlyArray<T>): ReadonlyArray<T> {
  return shuffle(this)
}

// @ts-ignore
Array.prototype['median'] = function(this: ReadonlyArray<number>): number {
  return median(this)
} as never // conflict with object

// @ts-ignore
Array.prototype['flatten'] = function<T>(this: ReadonlyArray<ReadonlyArray<T> | null | undefined | T>): ReadonlyArray <T> {
  return flatten(this)
} as never // conflict with object

// @ts-ignore
Array.prototype['sequence'] = function<T>(this: ReadonlyArray<Promise<T>>): Promise<ReadonlyArray<T>> {
  return sequence(this)
} as never // conflict with object

// @ts-ignore
Array.prototype['groupBy'] = function<T extends Record<string, unknown>>(this: ReadonlyArray<T>, key: keyof T): ReadonlyArray<ReadonlyArray<T>> {
  return groupBy(this, key)
}