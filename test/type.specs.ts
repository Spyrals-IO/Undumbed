import "mocha"
import fc from "fast-check"
import * as type from "../src/type"

fc.configureGlobal({ numRuns: 10_000 });

describe("type utils:", () => {
  describe("isString", () => {
    it("should detect strings", () => {
      fc.assert(fc.property(fc.string(), (s) => type.isString(s)))
    })
    it("should reject non-strings", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'string'), (x) => !type.isString(x)))
    })
  })
  describe("isNumber", () => {
    it("should detect numbers", () => {
      fc.assert(fc.property(fc.double(), (n) => type.isNumber(n)))
    })
    it("should reject non-numbers", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'number'), (x) => !type.isNumber(x)))
    })
  })
  describe("isNil", () => {
    it("should detect null or undefined", () => {
      fc.assert(fc.property(fc.constant(null), (v) => type.isNil(v)))
      fc.assert(fc.property(fc.constant(undefined), (v) => type.isNil(v)))
    })
    it("should reject other values", () => {
      fc.assert(fc.property(fc.anything().filter(x => x !== null && x !== undefined), (x) => !type.isNil(x)))
    })
  })
  describe("isNotNil", () => {
    it("should detect non-null/undefined values", () => {
      fc.assert(fc.property(fc.anything().filter(x => x !== null && x !== undefined), (x) => type.isNotNil(x)))
    })
    it("should reject null or undefined", () => {
      fc.assert(fc.property(fc.constant(null), (v) => !type.isNotNil(v)))
      fc.assert(fc.property(fc.constant(undefined), (v) => !type.isNotNil(v)))
    })
  })
  describe("isError", () => {
    it("should detect errors", () => {
      fc.assert(fc.property(fc.constant(new Error()), (e) => type.isError(e)))
    })
    it("should reject non-errors", () => {
      fc.assert(fc.property(fc.anything().filter(x => !(x instanceof Error)), (x) => !type.isError(x)))
    })
  })
  describe("isFunction", () => {
    it("should detect functions", () => {
      fc.assert(fc.property(fc.func(fc.anything()), (f) => type.isFunction(f)))
    })
    it("should reject non-functions", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'function'), (x) => !type.isFunction(x)))
    })
  })
  describe("isArray", () => {
    it("should detect arrays", () => {
      fc.assert(fc.property(fc.array(fc.anything()), (arr) => type.isArray(arr)))
    })
    it("should reject non-arrays", () => {
      fc.assert(fc.property(fc.anything().filter(x => !Array.isArray(x)), (x) => !type.isArray(x)))
    })
  })
  describe("isDate", () => {
    it("should detect dates", () => {
      fc.assert(fc.property(fc.date(), (d) => type.isDate(d)))
    })
    it("should reject non-dates", () => {
      fc.assert(fc.property(fc.anything().filter(x => !(x instanceof Date)), (x) => !type.isDate(x)))
    })
  })
  describe("isObject", () => {
    it("should detect plain objects", () => {
      fc.assert(fc.property(fc.object(), (o) => type.isObject(o)))
    })
    it("should reject non-plain objects", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'object' || x === null || Array.isArray(x)), (x) => !type.isObject(x)))
    })
  })
  describe("isBigInt", () => {
    it("should detect bigints", () => {
      fc.assert(fc.property(fc.bigInt(), (b) => type.isBigInt(b)))
    })
    it("should reject non-bigints", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'bigint'), (x) => !type.isBigInt(x)))
    })
  })
  describe("isBoolean", () => {
    it("should detect booleans", () => {
      fc.assert(fc.property(fc.boolean(), (b) => type.isBoolean(b)))
    })
    it("should reject non-booleans", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'boolean'), (x) => !type.isBoolean(x)))
    })
  })
  describe("isSymbol", () => {
    it("should detect symbols", () => {
      fc.assert(fc.property(fc.constant(Symbol()), (s) => type.isSymbol(s)))
    })
    it("should reject non-symbols", () => {
      fc.assert(fc.property(fc.anything().filter(x => typeof x !== 'symbol'), (x) => !type.isSymbol(x)))
    })
  })
  describe("isNull", () => {
    it("should detect null", () => {
      fc.assert(fc.property(fc.constant(null), (v) => type.isNull(v)))
    })
    it("should reject non-null", () => {
      fc.assert(fc.property(fc.anything().filter(x => x !== null), (x) => !type.isNull(x)))
    })
  })
  describe("isUndefined", () => {
    it("should detect undefined", () => {
      fc.assert(fc.property(fc.constant(undefined), (v) => type.isUndefined(v)))
    })
    it("should reject non-undefined", () => {
      fc.assert(fc.property(fc.anything().filter(x => x !== undefined), (x) => !type.isUndefined(x)))
    })
  })
}) 