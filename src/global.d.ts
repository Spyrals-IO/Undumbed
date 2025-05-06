interface ArrayConstructor {
  range: typeof import('./array').range
  chunk: typeof import('./array').chunk
  last: typeof import('./array').last
  sum: typeof import('./array').sum
  zipWithIndex: typeof import('./array').zipWithIndex
  unzip: typeof import('./array').unzip
  isEmpty: typeof import('./array').isEmpty
  distinct: typeof import('./array').distinct
  show: typeof import('./array').show
  zip: typeof import('./array').zip
  append: typeof import('./array').append
  excludes: typeof import('./array').excludes
  updateAt: typeof import('./array').updateAt
  pick: typeof import('./array').pick
  prepend: typeof import('./array').prepend
  uniq: typeof import('./array').uniq
  uniqFor: typeof import('./array').uniqFor
  uniqBy: typeof import('./array').uniqBy
  take: typeof import('./array').take
  takeRight: typeof import('./array').takeRight
  cartesianProduct: typeof import('./array').cartesianProduct
  shuffle: typeof import('./array').shuffle
  median: typeof import('./array').median
  flatten: typeof import('./array').flatten
  sequence: typeof import('./array').sequence
  groupBy: typeof import('./array').groupBy
}

interface ObjectConstructor {
  entries: typeof import('./object').entries
  map: typeof import('./object').map
  flatten: typeof import('./object').flatten
  includes: typeof import('./object').includes
  filter: typeof import('./object').filter
  reduce: typeof import('./object').reduce
  sequence: typeof import('./object').sequence
  sum: typeof import('./object').sum
  median: typeof import('./object').median
  isEmpty: typeof import('./object').isEmpty
  show: typeof import('./object').show
  excludes: typeof import('./object').excludes
  updateAt: typeof import('./object').updateAt
}

interface FunctionConstructor {
  doNothing: typeof import('./functions').doNothing
  identity: typeof import('./functions').identity
  promisify: typeof import('./functions').promisify
  compose: typeof import('./functions').compose
  negate: typeof import('./functions').negate
} 