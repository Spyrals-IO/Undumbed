export const doNothing = (): void => {};
export const identity = <T>(e: T): T => e

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisify = <F extends (..._params: ReadonlyArray<any>) => unknown>(f: F): (..._params: Parameters<F>) => Promise<Awaited<ReturnType<F>>> => (...args) => new Promise((resolve, reject) => {
  try {
    resolve(f(...args) as never)
  } catch(e) {
    reject(e)
  }
})

export const compose = <A, B, R>(f: (a: A) => B, g: (b: B) => R): (a: A) => R => (a: A) => g(f(a))
