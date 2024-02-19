import "mocha"
import fc, { Value } from "fast-check"
import { areEquals, isEmpty, isNotEmpty } from "../src/any"

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
    fc.assert(fc.property(fc.constant(null), (value) => {
      return isEmpty(value);
    }));

    fc.assert(fc.property(fc.constant(undefined), (value) => {
      return isEmpty(value);
    }));
  });

  it("Should return true for false boolean", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => isEmpty(value) === !value)
    )
  })

  it("Should return false for true boolean", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => !isEmpty(value) === value)
    );
  });

  it("Should return true for BigInt or Number values equal to 0", () =>
    fc.assert(
      fc.property(fc.oneof(fc.bigInt(), fc.integer()), (value) => {
        isEmpty(value) === (value === 0n)
      }
      )
    ));

  it("Should return false for BigInt or Number values not equal to 0", () =>
    fc.assert(
      fc.property(fc.oneof(fc.bigInt(), fc.integer({ min: 1 })), (value) =>
        !isEmpty(value)
      )
    ))

  it("Should return true for empty Date", () => {
    fc.assert(
      fc.property(fc.date(), (value) => {
        const emptyDate = new Date(0);
        return isEmpty(value) === (value.getTime() === emptyDate.getTime());
      })
    );
  });

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
})
