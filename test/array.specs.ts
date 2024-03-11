import "mocha"
import fc from "fast-check"
import { takeRight } from "../src/array"
import { strict as assert } from "assert"

describe("takeRight: ", () => {
  it("Should take the specified number of elements from the end of the array", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat(100), (numbers, length) => {
        const taken = takeRight(numbers, length);
        const expected = numbers.slice(-length)
        return assert.deepStrictEqual(taken, expected);
      })
    );
  })

  it("Should return the entire array if length is greater than or equal to array length", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat(100), (numbers, length) => {
        const taken = takeRight(numbers, length + numbers.length);
        return assert.deepStrictEqual(taken, numbers);
      })
    )
  });

  it("Should handle an empty array and retunr and empty array", () => {
    fc.assert(
      fc.property(fc.nat(100), (length) => {
        const result = takeRight([], length);
        assert.deepStrictEqual(result, []);
      })
    );
  });

  it("Should handle arrays with multiple types of elements", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.nat(100), (array, length) => {
        const result = takeRight(array, length);
        const expected = array.slice(-length);
        return assert.deepStrictEqual(result, expected);
      })
    );
  })
})


