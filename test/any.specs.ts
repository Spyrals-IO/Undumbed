import "mocha"
import fc  from "fast-check"
import { areEquals, isEmpty, isNotEmpty } from "../src/any"

const nonEmptyObject = () => fc.object().filter(obj => Object.keys(obj).length > 0)

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
      fc.property(nonEmptyObject(), (value) => {
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

  it("Should return false for true boolean", () => {
    fc.assert(fc.property(fc.constant(true), (boo) => !isEmpty(boo)))
  });

  it("Should return true for BigInt equal to 0", () => {
    fc.assert(fc.property(fc.constant(0n), (value) => {
          isEmpty(value)
      })
    )
  });


  it("Should return true for number equal to 0", () => {
    fc.assert(fc.property(fc.constant(0), (value) => {
          isEmpty(value)
      })
    )
  });

  it("Should return false for BigInt not equal to 0", () =>
    fc.assert(fc.property(fc.bigInt({ max: -1n }),(value) => {
      !isEmpty(value)
    }))
  )

  it("Should return false for number not equal to 0", () =>
    fc.assert(fc.property(fc.double({ min: 1 }), (value) => {
      !isEmpty(value)
    }))
  )

  it("Should return true for empty Date", () =>
    fc.assert(fc.property(fc.constant(new Date(0)), (value) => 
      isEmpty(value)
    ))
  );  

  it("Should return false for non-empty Date", () => {
    fc.assert(fc.property(fc.date({ min: new Date(1) }), (value) => 
      !isEmpty(value)
    ))
  })

  it("Should return true for empty symbols", () =>
    fc.assert(fc.property(fc.constant(Symbol()), (value) => {
        isEmpty(value);
    }))
  );

  const nonEmptySymbol = () => fc.string().map(str => Symbol(str))
  it("Should return false for non-empty symbols", () =>
    fc.assert(fc.property(nonEmptySymbol(), (sym) => 
      !isEmpty(sym)
    ))
  )
})

//isNotEmpty
describe("isNotEmpty: ", () => {
  it("Should return true when isEmpty dont", () => {
    fc.assert(fc.property(fc.anything(), (value) => 
        isNotEmpty(value) !== isEmpty(value)
    ))
  })
})

//areEquals
describe("areEquals: ", () => {
  it("Should return true for same values", () => {
    fc.assert(fc.property(fc.anything(), (value) =>
      areEquals(value, value)
    ))
  })

  it("Should return false for different values", () => {
    fc.assert(
      fc.property(fc.anything(), fc.anything(), (value1, value2) => {
        fc.pre(value1 !== value2);
        return !areEquals(value1, value2)
      })
    )
  })

  const twoObjectsWithSameKeysButDifferentValues = () => fc.object().chain(obj => 
    fc.tuple(
      fc.constant(obj),
      fc.record(Object.fromEntries(Object.keys(obj).map((key) => 
        [key, fc.anything().filter(anotherValue => JSON.stringify(anotherValue) !== JSON.stringify(obj[key]))]
      ))),
    )
  )

  it("Should return false for objects with same keys but different values, strictly or not", () =>
    fc.assert(fc.property(twoObjectsWithSameKeysButDifferentValues(), ([obj1, obj2]) => 
      !areEquals(obj1, obj2)
    ))
  )

  it("Should deeply compare arrays", () => fc.assert(fc.property(fc.array(fc.anything()), (arr) =>
    areEquals(arr, arr)
  )))
})
