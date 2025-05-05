import "mocha"
import fc from "fast-check"
import * as TryMod from "../src/try"

fc.configureGlobal({ numRuns: 10_000 });

describe("Try utils:", () => {
  describe("Try", () => {
    it("should wrap a value", () => {
      fc.assert(fc.property(fc.anything(), (x) => {
        const t = TryMod.Try(() => x)
        return Object.is(t.value, x)
      }))
    })
    it("should wrap an error if thrown", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      return t.value === err
    })
  })
  describe("map", () => {
    it("should map the value if not error", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        const t2 = TryMod.map(t, n => n + 1)
        return Object.is(t2.value, x + 1)
      }))
    })
    it("should not map if error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const t2 = TryMod.map(t, (n: number) => n + 1)
      return t2.value === err
    })
  })
  describe("flatMap", () => {
    it("should flatMap the value if not error", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        const t2 = TryMod.flatMap(t, n => TryMod.Try(() => n + 1))
        return Object.is(t2.value, x + 1)
      }))
    })
    it("should not flatMap if error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const t2 = TryMod.flatMap(t, (n: number) => TryMod.Try(() => n + 1))
      return t2.value === err
    })
  })
  describe("flatten", () => {
    it("should flatten nested Try", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => TryMod.Try(() => x))
        const flat = TryMod.flatten(t)
        return Object.is(flat.value, x)
      }))
    })
    it("should not flatten if outer is error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const flat = TryMod.flatten(t)
      return flat.value === err
    })
  })
  describe("mapError", () => {
    it("should map the error if present", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const t2 = TryMod.mapError(t, e => new Error("other"))
      return t2.value.message === "other"
    })
    it("should not map error if value", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        const t2 = TryMod.mapError(t, e => new Error("other"))
        return Object.is(t2.value, x)
      }))
    })
  })
  describe("recover", () => {
    it("should recover from error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const t2 = TryMod.recover(t, e => 42)
      return Object.is(t2.value, 42)
    })
    it("should not recover if value", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        const t2 = TryMod.recover(t, e => 42)
        return Object.is(t2.value, x)
      }))
    })
  })
  describe("flatRecover", () => {
    it("should flatRecover from error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      const t2 = TryMod.flatRecover(t, e => TryMod.Try(() => 42))
      return Object.is(t2.value, 42)
    })
    it("should not flatRecover if value", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        const t2 = TryMod.flatRecover(t, e => TryMod.Try(() => 42))
        return Object.is(t2.value, x)
      }))
    })
  })
  describe("getOrElse", () => {
    it("should return value if present", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        return Object.is(TryMod.getOrElse(t, 42), x)
      }))
    })
    it("should return fallback if error", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      return Object.is(TryMod.getOrElse(t, 42), 42)
    })
  })
  describe("errorOrElse", () => {
    it("should return error if present", () => {
      const err = new Error("fail")
      const t = TryMod.Try(() => { throw err })
      return TryMod.errorOrElse(t, new Error("other")).message === "fail"
    })
    it("should return fallback error if value", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const t = TryMod.Try(() => x)
        return TryMod.errorOrElse(t, new Error("other")).message === "other"
      }))
    })
  })
}) 