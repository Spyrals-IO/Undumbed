export interface Try<T> {
  readonly value: T | Error
  map<T1>(f: (value: T) => T1): Try<T1>
  mapError(f: (err: Error) => Error): Try<T>
  flatMap<T1>(f: (value: T) => Try<T1>): Try<T1>
  flatten<T1>(this: Try<Try<T1>>): Try<T1>
  recover<T1>(f: (err: Error) => T1): Try<T | T1>
  flatRecover<T1>(f: (err: Error) => Try<T1>): Try<T | T1>
  getOrElse<T1>(other: T1): T | T1
  errorOrElse(defaultError: Error): Error
}

export const isTry = (value: unknown): value is Try<unknown> => 
  value instanceof InnerTry || (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'map' in value &&
    'flatMap' in value &&
    'flatten' in value &&
    'mapError' in value &&
    'recover' in value &&
    'getOrElse' in value &&
    'errorOrElse' in value
  )


export const Try = <T>(block: () => T): Try<T> => {
  try {
    return new InnerTry(block())
  } catch (error) {
    return new InnerTry(error as never)
  }
}

export const map = <T1, T2>(tr: Try<T1>, f: (value: T1) => T2): Try<T2> =>
  tr.value instanceof Error ? tr as unknown as Try<T2> : new InnerTry<T2>(f(tr.value))

export const flatMap = <T1, T2>(tr: Try<T1>, f: (value: T1) => Try<T2>): Try<T2> => {
  if(tr.value instanceof Error) {
    return tr as unknown as Try<T2>
  } else {
    const mapped = f(tr.value)
    const doubleTry: Try<Try<T2>> = new InnerTry(mapped)
    
    return doubleTry.flatten()
  }
}

export const flatten = <T>(tr: Try<Try<T>>): Try<T> => {
  if(tr.value instanceof Error) {
    return tr as unknown as Try<T>
  } else {
    return tr.value
  }
}

export const mapError = <T>(tr: Try<T>, f: (err: Error) => Error): Try<T> => {
  if(tr.value instanceof Error) {
    return new InnerTry<T>(f(tr.value))
  } else {
    return tr
  }
}

export const recover = <T, T1>(tr: Try<T>, f: (err: Error) => T1): Try<T | T1> => {
  if(tr.value instanceof Error) {
    return new InnerTry<T1>(f(tr.value))
  } else {
    return tr
  }
}


export const flatRecover = <T, T1>(tr: Try<T>, f: (err: Error) => Try<T1>): Try<T | T1> => {
  const recovered = recover(tr, f)
  if(recovered.value instanceof Error) {
    return recovered as unknown as Try<T | T1>
  } else if(isTry(recovered.value)) {
    return (recovered as Try<Try<T1>>).flatten()
  } else {
    return tr
  }
}

export const getOrElse = <T, T1>(tr: Try<T>, other: T1): T | T1 => {
  if(tr.value instanceof Error) {
    return other
  } else {
    return tr.value
  }
}

export const errorOrElse = <T, T1>(tr: Try<T>, defaultError: Error): Error => {
  if(tr.value instanceof Error) {
    return tr.value
  } else {
    return defaultError
  }
}

class InnerTry<T> implements Try<T> {
  constructor(public readonly value: T | Error) {}
  map<T1>(f: (value: T) => T1): Try<T1> {
    return map(this, f)
  }
  flatMap<T1>(f: (value: T) => Try<T1>): Try<T1> {
    return flatMap(this,f)
  }
  flatRecover<T1>(f: (err: Error) => Try<T1>): Try<T | T1> {
      return flatRecover(this, f)
  }
  flatten<T1>(this: Try<Try<T1>>): Try<T1> {
    return flatten(this)
  }
  mapError(f: (err: Error) => Error): Try<T> {
    return mapError(this, f)
  }
  recover<T1>(f: (err: Error) => T1): Try<T | T1> {
    return recover(this, f)
  }
  getOrElse<T1>(other: T1): T | T1 {
    return getOrElse(this, other)
  }
  errorOrElse(defaultError: Error): Error {
    return errorOrElse(this, defaultError)
  }
}