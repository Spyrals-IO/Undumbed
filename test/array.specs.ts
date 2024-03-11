import "mocha"
import fc from "fast-check"
import { pick } from "../src/array"
import { strict as assert } from "assert"

describe("pick: ", () => {
  it("Should return undefined for an empty array", () => {
    fc.assert(
      fc.property(fc.constant([]), () => {
        assert.strictEqual(pick([]), undefined);
      })
    )
  })
  
    it("Should return a valid element for a non-empty array", () => {
      fc.assert(
        fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
          const pickedValue = pick(arr);
          assert.ok(arr.includes(pickedValue));
        })
      )
    })
  })