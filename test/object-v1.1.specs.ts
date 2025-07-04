import "mocha";
import fc from "fast-check";
import { merge, mergeWith, deepMerge, pick, omit, keys, values, invert, mapKeys } from "../src/object";

fc.configureGlobal({ numRuns: 10_000 });

describe("merge: ", () => {
  it("Should merge two objects with second taking precedence", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ a: fc.integer(), c: fc.boolean() }),
        (obj1, obj2) => {
          const result = merge(obj1, obj2);
          
          // Values from obj2 should take precedence for common keys
          const obj2KeysCorrect = result.a === obj2.a && result.c === obj2.c;
          
          // Values from obj1 should be present for non-conflicting keys
          const obj1UniqueCorrect = result.b === obj1.b;
          
          return obj2KeysCorrect && obj1UniqueCorrect;
        }
      )
    ));

  it("Should handle empty objects", () => {
    const obj = { a: 1, b: 2 };
    const result1 = merge(obj, {});
    const result2 = merge({}, obj);
    
    return JSON.stringify(result1) === JSON.stringify(obj) &&
           JSON.stringify(result2) === JSON.stringify(obj);
  });
});

describe("mergeWith: ", () => {
  it("Should use resolver function for conflicting keys", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.integer() }),
        fc.record({ a: fc.integer(), c: fc.integer() }),
        (obj1, obj2) => {
          const result = mergeWith(obj1, obj2, (key, v1, v2) => v1 + v2);
          
          // Conflicting key 'a' should be sum of both values
          const conflictResolved = result.a === obj1.a + obj2.a;
          
          // Non-conflicting keys should be preserved
          const b_preserved = result.b === obj1.b;
          const c_preserved = result.c === obj2.c;
          
          return conflictResolved && b_preserved && c_preserved;
        }
      )
    ));

  it("Should preserve non-conflicting keys", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.string(), x: fc.integer() }),
        fc.record({ b: fc.string(), y: fc.integer() }),
        (obj1, obj2) => {
          const result = mergeWith(obj1, obj2, () => "conflict");
          
          return result.a === obj1.a && result.x === obj1.x &&
                 result.b === obj2.b && result.y === obj2.y;
        }
      )
    ));

  it("Should call resolver ONLY for common keys", () => {
    const obj1 = { a: 1, b: 2, x: 10 };
    const obj2 = { a: 3, c: 4, y: 20 };
    
    const resolverCalls: string[] = [];
    const result = mergeWith(obj1, obj2, (key, v1, v2) => {
      resolverCalls.push(key);
      return v1 + v2;
    });
    
    // Resolver should only be called for common key 'a'
    const onlyCommonKeyCalled = resolverCalls.length === 1 && resolverCalls[0] === 'a';
    
    // Result should have all keys with correct values
    const correctResult = result.a === 4 && // 1 + 3 (resolved)
                         result.b === 2 && // from obj1
                         result.c === 4 && // from obj2
                         result.x === 10 && // from obj1
                         result.y === 20; // from obj2
    
    return onlyCommonKeyCalled && correctResult;
  });
});

describe("deepMerge: ", () => {
  it("Should merge nested objects recursively", () => {
    const obj1 = { a: 1, nested: { x: 1, y: 2 } };
    const obj2 = { b: 2, nested: { x: 10, z: 3 } };
    const result = deepMerge(obj1, obj2) as any;
    
    return result.a === 1 && result.b === 2 &&
           result.nested.x === 10 && result.nested.y === 2 && result.nested.z === 3;
  });

  it("Should handle primitive conflicts by taking second value", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ a: fc.integer(), c: fc.boolean() }),
        (obj1, obj2) => {
          const result = deepMerge(obj1, obj2) as any;
          
          return result.a === obj2.a && result.b === obj1.b && result.c === obj2.c;
        }
      )
    ));

  it("Should handle arrays by replacing", () => {
    const obj1 = { arr: [1, 2, 3], x: 1 };
    const obj2 = { arr: [4, 5], y: 2 };
    const result = deepMerge(obj1, obj2) as any;
    
    return JSON.stringify(result.arr) === JSON.stringify([4, 5]) &&
           result.x === 1 && result.y === 2;
  });
});

describe("pick: ", () => {
  it("Should select only specified keys", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = pick(obj, ['a', 'c']);
    
    // Should have only the picked keys
    const hasOnlyPickedKeys = Object.keys(result).length === 2 &&
                             'a' in result && 'c' in result && !('b' in result);
    
    // Values should be correct
    const valuesCorrect = result.a === obj.a && result.c === obj.c;
    
    return hasOnlyPickedKeys && valuesCorrect;
  });

  it("Should handle non-existent keys gracefully", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = pick(obj, ['a', 'nonExistent'] as any);
    
    // Should only have existing keys
    return Object.keys(result).length === 1 && result.a === obj.a;
  });

  it("Should handle empty key array", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = pick(obj, []);
    return Object.keys(result).length === 0;
  });
});

describe("omit: ", () => {
  it("Should exclude specified keys", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = omit(obj, ['b']);
    
    // Should not have omitted keys
    const hasCorrectKeys = Object.keys(result).length === 2 &&
                          'a' in result && 'c' in result && !('b' in result);
    
    // Values should be correct
    const valuesCorrect = result.a === obj.a && result.c === obj.c;
    
    return hasCorrectKeys && valuesCorrect;
  });

  it("Should handle empty key array", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = omit(obj, []);
    return JSON.stringify(result) === JSON.stringify(obj);
  });
});

describe("keys: ", () => {
  it("Should return all object keys", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string(), c: fc.boolean() }),
        (obj) => {
          const result = keys(obj);
          const originalKeys = Object.keys(obj);
          
          return result.length === originalKeys.length &&
                 result.every(key => originalKeys.includes(key)) &&
                 originalKeys.every(key => result.includes(key));
        }
      )
    ));

  it("Should handle empty objects", () => {
    const result = keys({});
    return result.length === 0;
  });
});

describe("values: ", () => {
  it("Should return all object values", () =>
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string(), c: fc.boolean() }),
        (obj) => {
          const result = values(obj);
          const originalValues = Object.values(obj);
          
          return result.length === originalValues.length &&
                 result.every(value => originalValues.includes(value));
        }
      )
    ));

  it("Should handle empty objects", () => {
    const result = values({});
    return result.length === 0;
  });
});

describe("invert: ", () => {
  it("Should swap keys and values", () => {
    const obj = { a: 'x', b: 'y', c: 'z' };
    const result = invert(obj);
    
    return result.x === 'a' && result.y === 'b' && result.z === 'c';
  });

  it("Should handle numeric values", () => {
    const obj = { first: 1, second: 2, third: 3 };
    const result = invert(obj);
    
    return result[1] === 'first' && result[2] === 'second' && result[3] === 'third';
  });

  it("Should handle duplicate values by keeping last key", () => {
    const obj = { a: 'same', b: 'same', c: 'different' };
    const result = invert(obj);
    
    // Should have 'same' mapped to one of 'a' or 'b', and 'different' mapped to 'c'
    return Object.keys(result).length === 2 &&
           'same' in result && result.different === 'c';
  });
});

describe("mapKeys: ", () => {
  it("Should transform all keys using provided function", () => {
    const obj = { a: 1, b: "hello", c: true };
    const result = mapKeys(obj, (key) => `new_${key}`) as any;
    
    // All keys should be prefixed
    const keysTransformed = Object.keys(result).every(key => key.startsWith('new_'));
    
    // Values should be preserved
    const valuesPreserved = result.new_a === obj.a && 
                           result.new_b === obj.b && 
                           result.new_c === obj.c;
    
    return keysTransformed && valuesPreserved;
  });

  it("Should handle empty objects", () => {
    const result = mapKeys({}, (key) => `prefix_${key}`);
    return Object.keys(result).length === 0;
  });

  it("Should use both key and value in transformation", () => {
    const obj = { name: 'Alice', age: 25 };
    const result = mapKeys(obj, (key, value) => `${key}_${value}`) as any;
    
    return 'name_Alice' in result && 'age_25' in result &&
           result.name_Alice === 'Alice' && result.age_25 === 25;
  });
});
