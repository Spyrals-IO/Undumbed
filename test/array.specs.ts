import "mocha";
import fc from "fast-check";
import { take } from "../src/array";
import { strict as assert } from "assert";

describe("take: ", () => {
  it("Should take the specified number of elements from the start of the array", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat(100), (numbers, length) => {
        const taken = take(numbers, length)
        return taken.length <= length && taken.every((value, index) => value === numbers[index])
      })
    )
  })

  it("Should return the entire array if length is greater than or equal to array length", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat(100), (numbers, length) => {
        const taken = take(numbers, length + numbers.length);
        return taken.length === numbers.length && taken.every((value, index) => value === numbers[index]);
      })
    );
  });

  it("Should handle an empty array by returning an empty array", () => {
    fc.assert(
      fc.property(fc.constant([]), fc.nat(100), (emptyArray, length) => {
        const result = take(emptyArray, length)
        assert.deepStrictEqual(result, [])
      })
    )
  })

  it("Should handle an array with a single element", () => {
    fc.assert(
      fc.property(fc.anything(), (singleElement) => {
        const singleElementArray = [singleElement]
        const result = take(singleElementArray, 1)
        assert.deepStrictEqual(result, singleElementArray)
      })
    )
  })

  it("Should handle arrays with multiple types of elements", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.nat(100), (array, length) => {
        const result = take(array, length)
        assert.deepStrictEqual(result, array.slice(0, length))
      })
    )
  })
})
