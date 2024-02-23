import "mocha";
import fc from "fast-check";
import { sum, chunk, last, zipWithIndex, unzip, distinct } from "../src/array";
import { areEquals } from "../src/any";

describe("chunk: ", () => {
  it("Should split non-empty arrays into chunks of the specified size", () =>
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(fc.anything(), { minLength: 1 }), // Non-empty array
          fc.integer({ min: 1 }) // Size with a minimum value of 1
        ),
        ([array, size]) => {
          const result = chunk(array, size);
          // Check that all chunks (except the last one) have precisely the specified size
          const allChunksHaveCorrectSize = result
            .slice(0, -1) // Exclude the last chuk
            .every((chunk) => chunk.length === size);
          // Check that the last chunk has a size less than or equal to the specified sizee
          const lastChunkHasCorrectSize = result.slice(-1).every((chunk) => chunk.length <= size);
          return allChunksHaveCorrectSize && lastChunkHasCorrectSize;
        }
      ),
    ));


  it("Should return the original array when size is less than or equal to 0", () =>
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.integer({ max: 0 }), (array, size) => {
        const result = chunk(array, size);
        return result.length === 1 && result[0].every(element => array.includes(element));
      })
    ));


    it("Should return an empty array when handling empty input arrays with a generated non-zero size", () =>
    fc.assert(
      fc.property(fc.constant([]), fc.integer({ min: 1 }), (emptyArray, size) => {
        return chunk(emptyArray, size).length === 0;
      }),
    ));

});


describe("last: ", () => {
  it("Should return the last element of a non-empty array", () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
        const result = last(arr);
        return result === arr[arr.length - 1];
      })
    );
  });


    it("Should return undefined for an empty array", () => {
      fc.assert(
        fc.property(fc.array(fc.anything(), { maxLength: 0 }), (arr) => {
          return last(arr) === undefined
        })
      );
    });

  it("Should return the only element for a single-element array", () => {
    fc.assert(
      fc.property(fc.anything(), (element) => {
        const arr = [element];
        return last(arr) === element
      })
    );
  });
})

describe("sum: ", () => {
    it("Should return 0 for an empty array", () => {
      fc.assert(
        fc.property(fc.constant([]), (arr) => {
          return sum(arr) === 0
        }))})

    it("Should return the correct sum", () => {
      fc.assert(
        fc.property(fc.array(fc.double()), (arr) => {
          return sum(arr) === arr.reduce((acc, n) => acc + n, 0)
        })
      );
    });
  });

describe("zipWithIndex: ", () => {
    it("Should zip each element with its index", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
          const result = zipWithIndex(arr);
          return result.every(([v, i]) => arr[i] === v)
        })
      );
    });
  
    it("Should return an empty array for an empty input array", () => {
      fc.assert(
        fc.property(fc.constant([]), (arr) => {
          const result = zipWithIndex(arr);
          return result.length === 0
        })
      );
    });
  
    it("Should return a single-element array for a single-element input array", () => {
      fc.assert(
        fc.property(fc.anything(), (element) => {
          const arr = [element];
          const result = zipWithIndex(arr);
          return result.length === 1 && result[0][0] === element && result[0][1] === 0
        })
      );
    });
  });

  describe("unzip: ", () => {
    it("Should unzip arrays of pairs", () => {
      fc.assert(
        fc.property(
          fc.array(fc.tuple(fc.anything(), fc.anything()), { minLength: 1 }),
          (pairs) => {
            const [arr1, arr2] = unzip(pairs);
            return (
              arr1.every((e1, index1) => pairs[index1][0] === e1) && 
              arr2.every((e2, index2) => pairs[index2][1] === e2)
            )
          }
        )
      )
    })
  
    it("Should handle empty arrays", () => {
      fc.assert(
        fc.property(
          fc.constant([]),
          (pairs) => {
            const [arr1, arr2] = unzip(pairs);
            return arr1.length === 0 && arr2.length === 0
          }
        )
      )
    })
  })

  describe("distinct: ", () => {
    it("Should remove duplicates from any array", () =>
    fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
            const distinctArr = distinct(arr);
            const set = new Set(distinctArr);
            return distinctArr.length === set.size
        })
    ))

    it("Should return an empty array if one was passed", () => {
      fc.assert(
        fc.property(fc.constant([]), (arr) => {
          const distinctArr = distinct(arr);
          return distinctArr.length === 0
        })
      )
    });

    it("Should deduplicate elements of an array", () =>
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const duplicateArr = [...arr, ...arr];
          const distinctArr = distinct(duplicateArr);
          const set = new Set(distinctArr);
          return distinctArr.length === set.size
        })
      ))

    const arrayOfObjectWithKeyValuePairInCommon = () => fc.string({minLength: 1}).chain(key => 
      fc.tuple(fc.array(fc.object()), fc.anything()).map(([objs, value]) => 
        [key, objs.map(obj => ({...obj, [key]: value}))] as const
      )
    )
    it("It should remove element that have the same value for a key passed", () =>
      fc.assert(
        fc.property(arrayOfObjectWithKeyValuePairInCommon(), ([key, arr]) => {
          const distinctArr = distinct(arr, key);
          return distinctArr.length < arr.length || (distinctArr.length === 0 && arr.length === 0)
        })
      ))
    
})