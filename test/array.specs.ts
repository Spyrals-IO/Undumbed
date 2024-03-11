import fc from 'fast-check'
import { cartesianProduct } from '../src/array'

describe('cartesianProduct', () => {
  it('should compute the cartesian product of two arrays', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.array(fc.anything()), (arr1, arr2) => {
        const result = cartesianProduct(arr1, arr2)
        return result.every(([value1, value2]) => arr1.includes(value1) && arr2.includes(value2))
      })
    )
  })

  it('should handle empty arrays by returning an empty array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = cartesianProduct(arr, [])
        return result.length === 0
      })
    )
  })
})
