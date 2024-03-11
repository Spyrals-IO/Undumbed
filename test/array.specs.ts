import "mocha"
import fc from "fast-check"
import { uniq } from "../src/array"

describe("uniq: ", () => {
  it("Should remove any duplicate", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (elements) => {
        const duplicatedElements = [...elements, ...elements]
        const uniqueElements = uniq(duplicatedElements)
        return new Set(uniqueElements).size === new Set(elements).size
      })
    )
  })

  it("Should preserve the empty array when input is empty", () => {
    fc.assert(
      fc.property(fc.constant([]), (array) => {
        const result = uniq(array);
        return result.length === 0;
      })
    )
  })
})

