import fc from 'fast-check';
import { excludes } from '../src/array';

describe('excludes', () => {
  it('should exclude elements based on default comparison', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.array(fc.anything()), (arr, toExcludes) => {
        const result = excludes(arr, toExcludes);
        return result.every((el) => !toExcludes.includes(el))
      })
    )
  })
  
  it('should handle arrays with no elements to exclude', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const result = excludes(arr, [])
        return result.length === arr.length
      })
    )
  })

  it('should handle empty array by returning an empty array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (toExcludes) => {
        const result = excludes([], toExcludes);
        return result.length === 0;
      })
    );
  });
});