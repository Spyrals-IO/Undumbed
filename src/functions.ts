/**
 * A function that does nothing.
 */
export const doNothing = (): void => {};
/**
 * A function returning its parameter.
 */
export const identity = <T>(e: T): T => e

/**
 * Create a new function from the one provided, keeping the behavior but wrapping the result in a Promise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisify = <F extends (..._params: ReadonlyArray<any>) => unknown>(f: F): (..._params: Parameters<F>) => Promise<Awaited<ReturnType<F>>> => (...args) => new Promise((resolve, reject) => {
  try {
    resolve(f(...args) as never)
  } catch(e) {
    reject(e)
  }
})

/**
 * Compose to function into one.
 */
export const compose = <A, B, R>(f: (a: A) => B, g: (b: B) => R): (a: A) => R => (a: A) => g(f(a))
/**
 * For a given function returning a boolean, create a new function that will return the opposite boolean.
 */
export const negate = <I>(f: (input: I) => boolean): (input: I) => boolean => (input: I): boolean => !f(input)