import { identity } from './functions'
import { isArray, isFunction } from './type';

declare global {
  interface ReadonlyArray<T> {
    chunk(size: number): ReadonlyArray<ReadonlyArray<T>>
    last(): T | undefined
    sum(this: ReadonlyArray<number>): number
    zip<T1>(array: ReadonlyArray<T1>): ReadonlyArray<[T, T1]>;
    zipWithIndex(): ReadonlyArray<[T, number]>;
    unzip<A, B>(this: ReadonlyArray<[A, B]>): [ReadonlyArray<A>, ReadonlyArray<B>];
    isEmpty(): boolean
    distinct(key?: T extends object ? keyof T : never): ReadonlyArray<T>
    show(this: ReadonlyArray<string | number>, separator: string, start?: string, end?: string): string
    excludes(toExcludes: ReadonlyArray<T>, comparator?: (v1: T, v2: T) => boolean): ReadonlyArray<T>
    updateAt(array: ReadonlyArray<T>, objectIndex: number, newValue: T | ((value: T) => T)): ReadonlyArray<T>
    append(value: T | ReadonlyArray<T>): ReadonlyArray<T>
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

export const distinct = <T>(arr: ReadonlyArray<T>, key?: T extends object ? keyof T : undefined): ReadonlyArray<T> =>
  arr.filter((element, index) => arr.find((e, i) => index !== i && key ? element[key] === e[key] : element === e))

export const show = (arr: ReadonlyArray<string | number>, separator: string, start: string = '', end: string = ''): string =>
  arr.reduce((acc, e) => acc + e.toString() + separator , start) + end

export const zip = <T1, T2>(arr1: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> =>
  arr1.map((e1, index) => [e1, arr2[index]])

const defaultComparator = <T>(v1: T, v2: T): boolean => v1 === v2
export const excludes = <T>(arr: ReadonlyArray<T>, toExcludes: ReadonlyArray<T>, comparator: (v1: T, v2: T) => boolean = defaultComparator): ReadonlyArray<T> =>
  arr.filter(e1 => !toExcludes.find(e2 => comparator(e1, e2)))

export const updateAt = <T>(array: ReadonlyArray<T>, objectIndex: number, newValue: T | ((value: T) => T)): ReadonlyArray<T> => 
  array.map((item, index) => index === objectIndex ? isFunction(newValue) ? newValue(item) : newValue : item)

export const append = <T>(array: ReadonlyArray<T>, value: T | ReadonlyArray<T>): ReadonlyArray<T> => 
  [...array, ...(!isArray(value) ? [value] : value) ]

  // TODOs
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

export const cartesianProduct = <T1, T2>(arr1: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> =>
  arr1.flatMap(value1 => arr2.map(value2 => [value1, value2] as [T1, T2]))

export const shuffle = <T>(arr: ReadonlyArray<T>): ReadonlyArray<T> => {
  const newArray = [...arr]
  for(let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = tmp
  }
  return newArray
}

export const median = (arr: ReadonlyArray<number>): number => {
  if (arr.length === 0) { return 0 }

  const mid = Math.floor(arr.length / 2)
  const nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
};

/** Object style */

Array.prototype['chunk'] = function<T>(this: ReadonlyArray<T>, size: number): ReadonlyArray<ReadonlyArray<T>> {
  return chunk(this, size)
}

Array.prototype['last'] = function<T>(this: ReadonlyArray<T>): T | undefined {
  return last(this)
}

Array.prototype['sum'] = function(this: ReadonlyArray<number>): number {
  return sum(this)
}

Array.prototype['zipWithIndex'] = function<T>(this: ReadonlyArray<T>): ReadonlyArray<[T, number]> {
  return zipWithIndex(this)
}

Array.prototype['unzip'] = function<A, B>(this: ReadonlyArray<[A, B]>): [ReadonlyArray<A>, ReadonlyArray<B>] {
  return unzip(this)
}

Array.prototype['isEmpty'] = function<T>(this: ReadonlyArray<T>): boolean {
  return isEmpty(this)
}

Array.prototype['distinct'] = function<T>(this: ReadonlyArray<T>, key?: T extends object ? keyof T : undefined): ReadonlyArray<T> {
  return distinct(this, key)
}

Array.prototype['show'] = function(this: ReadonlyArray<string | number>, separator: string, start: string = '', end: string = ''): string {
  return show(this, separator, start, end)
}

Array.prototype['zip'] = function<T1, T2>(this: ReadonlyArray<T1>, arr2: ReadonlyArray<T2>): ReadonlyArray<[T1, T2]> {
  return zip(this, arr2)
}

Array.prototype['excludes'] = function<T>(this: ReadonlyArray<T>, toExcludes: ReadonlyArray<T>, comparator: (v1: T, v2: T) => boolean = defaultComparator): ReadonlyArray<T> {
  return excludes(this, toExcludes, comparator)
}

Array.prototype['updateAt'] = function<T>(this: ReadonlyArray<T>, objectIndex: number, newValue: T | ((value: T) => T)): ReadonlyArray<T> {
  return updateAt(this, objectIndex, newValue)
}
