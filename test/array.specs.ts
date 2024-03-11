import "mocha"
import fc from "fast-check"
import { uniqFor } from "../src/array"

describe("uniqFor: ", () => {
    it("Should handle arrays with any duplicates using uniqFor", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const duplicatedArray = [...array, ...array]
            const comparator = (a: any, b: any) => a === b
            const uniqueArray = uniqFor(duplicatedArray, comparator)
            return new Set(uniqueArray).size === new Set(array).size
          })
        )
      })      

  it("Should handle an empty array", () => {
    fc.assert(
      fc.property(fc.constant([]), (array) => {
        const result = uniqFor(array, (a, b) => a === b)
        return result.length === 0
      })
    )
  })
})
