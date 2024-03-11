import "mocha"
import fc, { Value } from "fast-check"
import { areEquals, isEmpty, isNotEmpty } from "../src/any"
import { strict as assert } from "assert"

//isEmpty tests
describe("isEmpty: ", () => {
  it("Should return true for empty strings", () =>
    fc.assert(
      fc.property(fc.constant(""), (value) =>
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
      fc.property(fc.array(fc.constant([]), { maxLength: 0 }), (value) =>
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
        fc.property(fc.constant({}), (value) => {
            isEmpty(value)
        })
    ))

    it("Should return false for non-empty objects", () =>
    fc.assert(
        fc.property(fc.object().filter(obj => Object.keys(obj).length > 0), (value) => {
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
        fc.property(fc.oneof(fc.bigInt({ max: 0n }), fc.constant(0)), (value) => {
            isEmpty(value) === (value === 0n)
        }
        )
    ));

    it("Should return false for BigInt or Number values not equal to 0", () =>
    fc.assert(
      fc.property(fc.oneof(fc.bigInt({ max: -1n }), fc.float({ min: 1 })),(value) => {
        !isEmpty(value)
        })
    ))

    it("Should return true for empty Date", () =>
    fc.assert(
      fc.property(fc.constant(new Date(0)), (value) => isEmpty(value))
    )
    );  

  it("Should return false for non-empty Date", () => {
    fc.assert(
      fc.property(fc.date({ min: new Date(1) }), (value: Date) => !isEmpty(value))
    )
  })

  it("Should return true for empty symbols", () =>
  fc.assert(
    fc.property(fc.constant(Symbol()), (value) => {
      isEmpty(value);
    })
  ));

it("Should return false for non-empty symbols", () =>
  fc.assert(
    fc.property(fc.string(), (str) => {
      const nonEmptySymbol = Symbol(str);
      return !isEmpty(nonEmptySymbol);
    })
  ))
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
  .dictionary(fc.string(), fc.oneof(fc.anything()))
  .filter((obj) => Object.keys(obj).length > 0);  // Filtrer les objets vides



  it("Should return false for objects with same keys and values, but different types", () =>
  fc.assert(
    fc.property(sameKeysAndValuesArbitrary, (obj) => {
      // Create a new object with the same keys and values but different types
      const differentTypesObj = Object.fromEntries(
        Object.entries(obj).map(([key]) => [key, fc.anything()])
      );
      return !areEquals(obj, differentTypesObj);
    })
  )
)

  it("Should return false for objects with same keys but different values", () =>
  fc.assert(
    fc.property(
      sameKeysAndValuesArbitrary,
      sameKeysAndValuesArbitrary,
      (obj1, obj2) => {
        // S'assurer que obj2 a les mêmes clés que obj1 mais avec des valeurs différentes
        obj2 = Object.fromEntries(
          Object.entries(obj1).map(([key, value]) => [key, fc.oneof(fc.constant(value), fc.oneof(fc.string(), fc.integer()))])
        )
        return !areEquals(obj1, obj2);
      }
    )
  )
)

it("Should return false for objects with different types but equivalent values", () => {
  fc.assert(
    fc.property(
      sameKeysAndValuesArbitrary,
      sameKeysAndValuesArbitrary,
      (obj1, obj2) => {
        return  !areEquals(obj1, obj2);
      }
    )
  )
})
})
