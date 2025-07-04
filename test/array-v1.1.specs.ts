import "mocha";
import fc from "fast-check";
import { partition, collect, sliding, scanLeft, scanRight, iterator } from "../src/array";

const anythingButNan = () => fc.anything().filter(thing => !Number.isNaN(thing))

fc.configureGlobal({ numRuns: 10_000 });

describe("partition: ", () => {
  it("Should split array into two based on predicate", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (array) => {
          const [evens, odds] = partition(array, x => x % 2 === 0);
          
          // All elements in evens should be even
          const allEvensAreEven = evens.every(x => x % 2 === 0);
          // All elements in odds should be odd
          const allOddsAreOdd = odds.every(x => x % 2 !== 0);
          // Combined length should equal original
          const lengthsMatch = evens.length + odds.length === array.length;
          
          return allEvensAreEven && allOddsAreOdd && lengthsMatch;
        }
      )
    ));

  it("Should preserve original order within partitions", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        (array) => {
          const [truthy, falsy] = partition(array, (_, index) => index % 2 === 0);
          
          // Check that relative order is preserved
          let truthyIndex = 0;
          let falsyIndex = 0;
          
          for (let i = 0; i < array.length; i++) {
            if (i % 2 === 0) {
              if (truthy[truthyIndex] !== array[i]) return false;
              truthyIndex++;
            } else {
              if (falsy[falsyIndex] !== array[i]) return false;
              falsyIndex++;
            }
          }
          
          return true;
        }
      )
    ));

  it("Should handle empty arrays", () => {
    const [truthy, falsy] = partition([], () => true);
    return truthy.length === 0 && falsy.length === 0;
  });
});

describe("collect: ", () => {
  it("Should transform and filter in one pass", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (array) => {
          const result = collect(array, x => x % 2 === 0 ? x * 2 : 0);

          // All results should be even numbers doubled (0 is filtered out as falsy)
          // Doubled even numbers are always multiples of 4
          const allEvenDoubled = result.every(x => x !== 0 && x % 4 === 0);
          // Length should be <= original array length
          const lengthOk = result.length <= array.length;
          // Should only contain non-zero even numbers that were doubled
          const expectedCount = array.filter(x => x % 2 === 0 && x !== 0).length;
          const correctCount = result.length === expectedCount;
          
          return allEvenDoubled && lengthOk && correctCount;
        }
      )
    ));

  it("Should handle arrays where nothing passes", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (array) => {
          const result = collect(array, () => 0); // 0 is falsy, so filtered out
          return result.length === 0;
        }
      )
    ));

  it("Should handle arrays where everything passes", () =>
    fc.assert(
      fc.property(
        fc.array(anythingButNan()),
        (array) => {
          const result = collect(array, x => x);
          // Filter out falsy values from original array for comparison
          const truthyValues = array.filter(x => !!x);
          return result.length === truthyValues.length;
        }
      )
    ));
});

describe("sliding: ", () => {
  it("Should create sliding windows of correct size", () =>
    fc.assert(
      fc.property(
        fc.array(anythingButNan(), { minLength: 3, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        (array, windowSize) => {
          const windows = sliding(array, windowSize);
          
          if (windowSize > array.length) {
            return windows.length === 0;
          }
          
          // All windows should have the correct size
          const allWindowsCorrectSize = windows.every(window => window.length === windowSize);
          // Should have correct number of windows
          const correctNumberOfWindows = windows.length === Math.max(0, array.length - windowSize + 1);
          
          return allWindowsCorrectSize && correctNumberOfWindows;
        }
      )
    ));

  it("Should handle edge cases", () => {
    // Empty array
    fc.assert(fc.property(fc.integer({ min: 1 }), (size) => {
      return sliding([], size).length === 0;
    }));
    
    // Size 0 or negative
    fc.assert(fc.property(fc.array(anythingButNan()), (array) => {
      return sliding(array, 0).length === 0 && sliding(array, -1).length === 0;
    }));
  });

  it("Should preserve element order and values", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 3, maxLength: 8 }),
        (array) => {
          const windows = sliding(array, 3);
          
          return windows.every((window, i) => {
            return window.every((element, j) => element === array[i + j]);
          });
        }
      )
    ));
});

describe("scanLeft: ", () => {
  it("Should return array with initial value and all intermediate results", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer(),
        (array, initial) => {
          const result = scanLeft(array, initial, (acc, x) => acc + x);
          
          // First element should be initial value
          const firstIsInitial = result[0] === initial;
          // Length should be array.length + 1
          const correctLength = result.length === array.length + 1;
          // Last element should be the full sum
          const expectedSum = array.reduce((acc, x) => acc + x, initial);
          const lastIsSum = result[result.length - 1] === expectedSum;
          
          return firstIsInitial && correctLength && lastIsSum;
        }
      )
    ));

  it("Should handle empty arrays", () => {
    const result = scanLeft([], 42, (acc, x) => acc + x);
    return result.length === 1 && result[0] === 42;
  });
});

describe("scanRight: ", () => {
  it("Should return array with all intermediate results and initial value", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer(),
        (array, initial) => {
          const result = scanRight(array, initial, (x, acc) => x + acc);
          
          // Last element should be initial value
          const lastIsInitial = result[result.length - 1] === initial;
          // Length should be array.length + 1
          const correctLength = result.length === array.length + 1;
          // First element should be the full sum
          const expectedSum = array.reduce((acc, x) => acc + x, initial);
          const firstIsSum = result[0] === expectedSum;
          
          return lastIsInitial && correctLength && firstIsSum;
        }
      )
    ));

  it("Should handle empty arrays", () => {
    const result = scanRight([], 42, (x, acc) => x + acc);
    return result.length === 1 && result[0] === 42;
  });
});

describe("iterator: ", () => {
  it("Should iterate through all elements in order", () =>
    fc.assert(
      fc.property(
        fc.array(anythingButNan()),
        (array) => {
          const iter = iterator(array);
          const collected: any[] = [];
          
          let result = iter.next();
          while (!result.done) {
            collected.push(result.value);
            result = iter.next();
          }
          
          return collected.length === array.length && 
                 collected.every((value, index) => value === array[index]);
        }
      )
    ));

  it("Should handle empty arrays", () => {
    const iter = iterator([]);
    const result = iter.next();
    return result.done === true;
  });

  it("Should be properly done after iteration", () =>
    fc.assert(
      fc.property(
        fc.array(anythingButNan()),
        (array) => {
          const iter = iterator(array);
          
          // Consume all elements
          for (let i = 0; i < array.length; i++) {
            iter.next();
          }
          
          // Next call should be done
          const finalResult = iter.next();
          return finalResult.done === true;
        }
      )
    ));
}); 