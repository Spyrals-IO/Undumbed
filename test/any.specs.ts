import "mocha"
import fc, { Value } from "fast-check"
import { areEquals, isEmpty, isNotEmpty } from "../src/any"
import { strict as assert } from "assert"

//isEmpty tests
describe("isEmpty: ", () => {
  it("Should return true for empty strings", () =>
    fc.assert(
      fc.property(fc.string({ maxLength: 0 }), (value) =>
        isEmpty(value)
      )
    ))

  it("Should return false for non-empty strings", () =>
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (value) => !isEmpty(value)
      )
    ))

  it("Should return true for empty arrays", () =>
    fc.assert(
      fc.property(fc.array(fc.nat(), { maxLength: 0 }), (value) =>
        isEmpty(value)
      )
    ));

  it("Should return false for non-empty arrays", () =>
    fc.assert(
      fc.property(fc.array(fc.nat(), { minLength: 1 }), (value) => {
        return !isEmpty(value)
      })
    ))

  it("Should return true for empty objects", () =>
    fc.assert(
      fc.property(fc.object({ maxKeys: 0 }), (value) => {
        isEmpty(value)
      })
    ))

  it("Should return false for non-empty objects", () =>
    fc.assert(
      fc.property(fc.object({ maxKeys: 200 }), (value) => {
        !isEmpty(value)
      })
    ))

    it("Should return true for null or undefined values", () => {
      fc.assert(fc.property(fc.constant(null), (value) => isEmpty(value)));
      fc.assert(fc.property(fc.constant(undefined), (value) => isEmpty(value)));
    });

  it("Should return true for false boolean", () => {
    fc.assert(fc.property(fc.constant(false), (boo) => isEmpty(boo) === true))
  })  

  it("Should return false for true boolean", () =>
  fc.assert(
    fc.property(fc.constant(true), (boo) => !isEmpty(boo))
  )
);

  it("Should return true for BigInt or Number values equal to 0", () =>
  fc.assert(
    fc.property(fc.oneof(fc.bigInt(), fc.integer()).filter(value => value === 0n),(value) => {
        isEmpty(value) === (value === 0n)
      }
    )
  ));

  it("Should return false for BigInt or Number values not equal to 0", () =>
  fc.assert(
    fc.property(fc.oneof(fc.bigInt().filter(bigInt => bigInt !== 0n),fc.integer({ min: 1 })),(value) => 
      !isEmpty(value)
    )
  ))

  it("Should return true for empty Date", () =>
    fc.assert(
      fc.property(fc.constant(new Date(0)), (value) => isEmpty(value) === true)
    )
  );

  it("Should return false for non-empty Date", () => {
    fc.assert(
      fc.property(fc.date({ min: new Date(1) }), (value: Date) => !isEmpty(value))
    )
  })

  it("Should return true for empty Symbols", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        if (typeof value === 'symbol') {
          return isEmpty(value)
        }
      })
    )
  })

  it("Should return false for non-empty Symbols", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        if (typeof value === 'symbol') {
          return !isEmpty(value);
        }
      })
    )
  })
})

//isNotEmpty
describe("isNotEmpty: ", () => {
  it("Should return true for non-empty strings", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (value) => {
        return isNotEmpty(value)
      })
    )
  })

  it("Should return false for empty strings", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 0 }), (value) => {
        return !isNotEmpty(value);
      })
    );
  });
})

//areEquals
describe("areEquals: ", () => {
  it("Should return true for equal values", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        return areEquals(value, value)
      })
    )
  })

  it("Should return false for different values", () => {
    fc.assert(
      fc.property(fc.anything(), fc.anything(), (value1, value2) => {
        fc.pre(value1 !== value2);
        return !areEquals(value1, value2)
      })
    )
  })

// Définir un comparateur personnalisé pour les objets ayant les mêmes clés et valeurs, mais de types différents
const sameKeysAndValuesArbitrary = fc
  .dictionary(fc.string(), fc.oneof(fc.string(), fc.integer()))
  .filter((obj) => Object.keys(obj).length > 0)  // Filtrer les objets vides
  .map((obj) => {
    // Convertir "0" en 0 dans l'arbitraire
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "0") {
        obj[key] = 0;
      }
    });
    return obj;
  });


  it("Should return true for objects with same keys and values, but different types", () =>
    fc.assert(
      fc.property(sameKeysAndValuesArbitrary, (obj) =>
        areEquals(obj, { ...obj })
      )
    )
  )

  it("Should return false for objects with same keys but different values", () =>
  fc.assert(
    fc.property(
      sameKeysAndValuesArbitrary,
      sameKeysAndValuesArbitrary,
      (obj1, obj2) => {
        // S'assurer que obj2 a les mêmes clés que obj1 mais avec des valeurs différentes
        const differentValuesObj2 = Object.fromEntries(
          Object.entries(obj1).map(([key, value]) => [key, fc.oneof(fc.constant(value), fc.oneof(fc.string(), fc.integer()))])
        );

        return !areEquals(obj1, differentValuesObj2);
      }
    )
  )
)

it("Should return false for objects with different types but equivalent values", () => {
  const obj1 = { a: 42 };
  const obj2 = { a: "42" };
  const result = areEquals(obj1, obj2);
  assert.strictEqual(result, false);
})

it("Should return false for objects with undefined values in one but not the other", () => {
  const obj1 = { a: 42, b: undefined };
  const obj2 = { a: 42 };
  const result = areEquals(obj1, obj2);
  assert.strictEqual(result, false);
})
})
