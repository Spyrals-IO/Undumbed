import "mocha";
import fc from "fast-check";
import { chunk } from "../src/array"; 

describe("chunk: ", () => {
    it("Should split arrays into chunks of the specified size", () =>
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 1 }), //tableau non vide
          fc.nat(10), // la taille de chunk entre 0 et 10
          (array, size) => {
            const result = chunk(array, Math.max(size, 1)); // garantir que la taille du chunk est au moins 1
            return result.length > 0 && result.every((chunk) => chunk.length <= Math.max(size, 1));
          }
        )
      ));

  it("Should return the original array when size is less than or equal to 0", () =>
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ max: 0 }), (array, size) => {
        const result = chunk(array, size);
        return result.length === 1 && result[0] === array;
      })
    ));


  it("Should handle empty arrays", () =>
    fc.assert(
      fc.property(fc.array(fc.integer()), () => {
        return chunk([], 5).length === 0;
      })
    ));

  it("Should handle arrays with size equal to the length of the array", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        (array) => {
          const result = chunk(array, array.length);
          return (
            result.length === 1 &&
            result[0].length === array.length &&
            result[0].every((value, index) => value === array[index])
          );
        }
      )
    ));

    it("Should handle arrays with custom objects", () =>
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            key: fc.string(),
            value: fc.integer(),
          }),
          { minLength: 1 }
        ),
        fc.nat(10),
        (array, size) => {
          const result = chunk(array, Math.max(size, 1));
          return (
            result.length > 0 &&
            result.every((chunk) => chunk.length <= Math.max(size, 1))
          );
        }
      )
    ))

    fc.property(
        fc.array(fc.oneof(fc.integer(), fc.string(), fc.boolean()), { minLength: 1 }),
        fc.nat(10),
        (array, size) => {
          const result = chunk(array, Math.max(size, 1));
          return result.length > 0 && result.every((chunk) => chunk.length <= Math.max(size, 1));
        }
      )
      


});