import "mocha"
import fc from "fast-check"
import * as obj from "../src/object"

fc.configureGlobal({ numRuns: 10_000 });

describe("object utils:", () => {
  describe("entries", () => {
    it("should return key-value pairs for an object", () => {
      fc.assert(fc.property(fc.object(), (o) => {
        const entries = obj.entries(o)
        return entries.every(([k, v]) => Object.is(o[k], v))
      }))
    })
  })
  describe("map", () => {
    it("should map values of an object", () => {
      fc.assert(fc.property(fc.object(), fc.func(fc.anything()), (o, f) => {
        const mapped = obj.map(o, (_k, v) => f(v))
        return Object.keys(o).every(k => Object.is(mapped[k], f(o[k])))
      }))
    })
  })
  describe("flatten", () => {
    it("should remove null/undefined values", () => {
      const o = { a: 1, b: null, c: undefined, d: 2 }
      const flat = obj.flatten(o as Record<string, number | null | undefined>)
      return !('b' in flat) && !('c' in flat) && Object.is((flat as any).a, 1) && Object.is((flat as any).d, 2)
    })
  })
  describe("includes", () => {
    it("should return true if all keys/values in other are in self", () => {
      const o1 = { a: 1, b: 2 }
      const o2 = { a: 1 }
      return obj.includes(o1, o2) === true
    })
    it("should return false if a key/value is missing", () => {
      const o1 = { a: 1 }
      const o2 = { a: 2 }
      return obj.includes(o1, o2) === false
    })
  })
  describe("filter", () => {
    it("should filter object properties", () => {
      const o = { a: 1, b: 2, c: 3 }
      const filtered = obj.filter(o, (k, v) => v > 1)
      return Object.keys(filtered).every(k => filtered[k] > 1)
    })
  })
  describe("reduce", () => {
    it("should reduce object values", () => {
      const o = { a: 1, b: 2, c: 3 }
      const sum = obj.reduce(o, (acc, _k, v) => acc + v, 0)
      return Object.is(sum, 6)
    })
  })
  describe("sum", () => {
    it("should sum all values", () => {
      const o = { a: 1, b: 2, c: 3 }
      return Object.is(obj.sum(o), 6)
    })
  })
  describe("median", () => {
    it("should return the median value", () => {
      const o = { a: 1, b: 2, c: 3 }
      return Object.is(obj.median(o), 2)
    })
  })
  describe("isEmpty", () => {
    it("should return true for empty object", () => {
      return obj.isEmpty({}) === true
    })
    it("should return false for non-empty object", () => {
      return obj.isEmpty({ a: 1 }) === false
    })
  })
  describe("show", () => {
    it("should return a string representation", () => {
      const o = { a: 1, b: 2 }
      const s = obj.show(o)
      return typeof s === "string" && s.includes("a") && s.includes("b")
    })
  })
  describe("excludes", () => {
    it("should exclude specified keys", () => {
      const o = { a: 1, b: 2, c: 3 }
      const ex = obj.excludes(o, ["b"])
      return !('b' in ex) && Object.is((ex as any).a, 1) && Object.is((ex as any).c, 3)
    })
  })
  describe("updateAt", () => {
    it("should update or add a key", () => {
      const o = { a: 1 }
      const updated = obj.updateAt(o, "b" as any, 2)
      return Object.is(updated.a, 1) && Object.is((updated as any).b, 2)
    })
  })
}) 