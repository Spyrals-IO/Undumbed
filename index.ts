/// <reference path="./src/global.d.ts" />

import * as TryFns from './src/try.js'
export const Try = Object.assign(TryFns.Try, {
  map: TryFns.map,
  flatMap: TryFns.flatMap,
  flatten: TryFns.flatten,
  mapError: TryFns.mapError,
  recover: TryFns.recover,
  flatRecover: TryFns.flatRecover,
  getOrElse: TryFns.getOrElse,
  errorOrElse: TryFns.errorOrElse,
  isTry: TryFns.isTry
})

import * as AnyFns from './src/any.js'
export const Any = {
  areEquals: AnyFns.areEquals,
  isEmpty: AnyFns.isEmpty,
  isNotEmpty: AnyFns.isNotEmpty
}

import * as FunctionsFns from './src/functions.js'
Object.assign(Function, {
  doNothing: FunctionsFns.doNothing,
  identity: FunctionsFns.identity,
  promisify: FunctionsFns.promisify,
  compose: FunctionsFns.compose,
  negate: FunctionsFns.negate
})

import * as TypeFns from './src/type.js'
export const Type = {
  isString: TypeFns.isString,
  isNumber: TypeFns.isNumber,
  isNil: TypeFns.isNil,
  isNotNil: TypeFns.isNotNil,
  isError: TypeFns.isError,
  isFunction: TypeFns.isFunction,
  isArray: TypeFns.isArray,
  isDate: TypeFns.isDate,
  isObject: TypeFns.isObject,
  isBigInt: TypeFns.isBigInt,
  isBoolean: TypeFns.isBoolean,
  isSymbol: TypeFns.isSymbol,
  isNull: TypeFns.isNull,
  isUndefined: TypeFns.isUndefined
}

// array
import * as ArrayFns from './src/array.js'
Object.assign(Array, {
  range: ArrayFns.range,
  chunk: ArrayFns.chunk,
  last: ArrayFns.last,
  sum: ArrayFns.sum,
  zipWithIndex: ArrayFns.zipWithIndex,
  unzip: ArrayFns.unzip,
  isEmpty: ArrayFns.isEmpty,
  distinct: ArrayFns.distinct,
  show: ArrayFns.show,
  zip: ArrayFns.zip,
  append: ArrayFns.append,
  excludes: ArrayFns.excludes,
  updateAt: ArrayFns.updateAt,
  pick: ArrayFns.pick,
  prepend: ArrayFns.prepend,
  uniq: ArrayFns.uniq,
  uniqFor: ArrayFns.uniqFor,
  uniqBy: ArrayFns.uniqBy,
  take: ArrayFns.take,
  takeRight: ArrayFns.takeRight,
  cartesianProduct: ArrayFns.cartesianProduct,
  shuffle: ArrayFns.shuffle,
  median: ArrayFns.median,
  flatten: ArrayFns.flatten,
  sequence: ArrayFns.sequence,
  groupBy: ArrayFns.groupBy
})

// object
import * as ObjectFns from './src/object.js'
Object.assign(Object, {
  entries: ObjectFns.entries,
  map: ObjectFns.map,
  flatten: ObjectFns.flatten,
  includes: ObjectFns.includes,
  filter: ObjectFns.filter,
  reduce: ObjectFns.reduce,
  sequence: ObjectFns.sequence,
  sum: ObjectFns.sum,
  median: ObjectFns.median,
  isEmpty: ObjectFns.isEmpty,
  show: ObjectFns.show,
  excludes: ObjectFns.excludes,
  updateAt: ObjectFns.updateAt
})
