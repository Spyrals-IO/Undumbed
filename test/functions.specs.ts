import "mocha"
import fc from "fast-check"
import * as fn from "../src/functions"

fc.configureGlobal({ numRuns: 10_000 });

describe("functions utils:", () => {
  describe("doNothing", () => {
    it("should not throw and return undefined", () => {
      fc.assert(fc.property(fc.anything(), () => Object.is(fn.doNothing(), undefined)))
    })
  })
  describe("identity", () => {
    it("should return its argument", () => {
      fc.assert(fc.property(fc.anything(), (x) => Object.is(fn.identity(x), x)))
    })
  })
  describe("promisify", () => {
    it("should wrap a function result in a Promise", async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer(), async (x) => {
          const f = (n: number) => n + 1
          const pf = fn.promisify(f)
          return Object.is(await pf(x), f(x))
        })
      )
    })
    it("should reject if the function throws", async () => {
      const error = new Error("fail")
      const f = () => { throw error }
      const pf = fn.promisify(f)
      let thrown = false
      try {
        await pf()
      } catch (e) {
        thrown = e === error
      }
      if (!thrown) throw new Error("Did not throw as expected")
    })
  })
  describe("compose", () => {
    it("should compose two functions", () => {
      fc.assert(fc.property(fc.integer(), (x) => {
        const f = (n: number) => n + 1
        const g = (n: number) => n * 2
        const h = fn.compose(f, g)
        return Object.is(h(x), g(f(x)))
      }))
    })
  })
  describe("negate", () => {
    it("should negate a boolean function", () => {
      fc.assert(fc.property(fc.boolean(), (b) => {
        const f = (x: boolean) => x
        const neg = fn.negate(f)
        return neg(b) === !f(b)
      }))
    })
  })
}) 