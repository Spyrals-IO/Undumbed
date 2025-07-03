# 🚀 Undumbed

> Array, Object, Set, Map and other structures as they should just be

[![npm version](https://img.shields.io/npm/v/undumbed.svg)](https://www.npmjs.com/package/undumbed)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Undumbed** extends JavaScript's native objects with useful functional programming methods, making your code more expressive and concise. No more importing utility libraries for common operations!

## ✨ Features

- 🔧 **Enhanced Arrays**: chunk, distinct, zip, flatten, median, and more
- 📦 **Powerful Objects**: map, filter, reduce, sequence, show, and more  
- 🛡️ **Type Guards**: comprehensive type checking utilities
- 🎯 **Try Monad**: elegant error handling without try/catch
- 🔄 **Function Utilities**: compose, negate, promisify, and more
- 📝 **Zero Dependencies**: lightweight and performant
- 🏷️ **Full TypeScript Support**: complete type definitions

## 📦 Installation

```bash
npm install undumbed
```

## 🚀 Quick Start

```typescript
import 'undumbed';

// Enhanced Arrays
const numbers = [1, 2, 3, 4, 5, 6];
numbers.chunk(2);          // [[1, 2], [3, 4], [5, 6]]
numbers.distinct();        // [1, 2, 3, 4, 5, 6]
numbers.sum();            // 21
numbers.median();         // 3.5

// Powerful Objects  
const data = { a: 1, b: 2, c: 3 };
data.map((k, v) => v * 2);           // { a: 2, b: 4, c: 6 }
data.filter((k, v) => v > 1);        // { b: 2, c: 3 }
data.sum();                          // 6

// Type Guards
import { Type } from 'undumbed';
Type.isString("hello");              // true
Type.isArray([1, 2, 3]);            // true
Type.isNotNil(null);                 // false

// Try Monad for Error Handling
import { Try } from 'undumbed';
const result = Try(() => JSON.parse('{"valid": "json"}'))
  .map(obj => obj.valid)
  .getOrElse("default");             // "json"
```

## 📚 API Reference

### 🔢 Array Extensions

```typescript
const arr = [1, 2, 3, 4, 5];

// Grouping and chunking
arr.chunk(2);                    // [[1, 2], [3, 4], [5]]
arr.groupBy(x => x % 2);         // Group by predicate

// Statistics  
arr.sum();                       // 15
arr.median();                    // 3
arr.last();                      // 5

// Functional operations
arr.zipWithIndex();              // [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]]
arr.distinct();                  // Remove duplicates
arr.flatten();                   // Flatten nested arrays

// Utilities
arr.pick();                      // Random element
arr.shuffle();                   // Shuffle array
arr.take(3);                     // [1, 2, 3]
arr.takeRight(2);               // [4, 5]
```

### 📦 Object Extensions

```typescript
const obj = { name: "John", age: 30, city: "NYC" };

// Functional operations
obj.map((k, v) => typeof v === 'string' ? v.toUpperCase() : v);
obj.filter((k, v) => typeof v === 'string');
obj.reduce((acc, k, v) => acc + v, 0);

// Utilities
obj.isEmpty();                   // false
obj.show();                      // "{ name: John, age: 30, city: NYC }"
obj.excludes(['age']);           // { name: "John", city: "NYC" }
obj.updateAt('age', 31);         // { name: "John", age: 31, city: "NYC" }
```

### 🛡️ Type Guards

```typescript
import { Type } from 'undumbed';

Type.isString(value);            // Check if string
Type.isNumber(value);            // Check if number  
Type.isArray(value);             // Check if array
Type.isObject(value);            // Check if object
Type.isFunction(value);          // Check if function
Type.isDate(value);              // Check if Date
Type.isError(value);             // Check if Error
Type.isNil(value);               // Check if null or undefined
Type.isNotNil(value);            // Check if not null/undefined
```

### 🎯 Try Monad

```typescript
import { Try } from 'undumbed';

// Safe operations that might fail
const parseJson = (str: string) => Try(() => JSON.parse(str));

const result = parseJson('{"name": "John"}')
  .map(obj => obj.name)
  .map(name => name.toUpperCase())
  .getOrElse("Unknown");         // "JOHN"

const failed = parseJson('invalid json')
  .map(obj => obj.name)
  .getOrElse("Unknown");         // "Unknown"

// Chain operations
Try(() => riskyOperation())
  .flatMap(result => Try(() => anotherRiskyOperation(result)))
  .recover(error => handleError(error))
  .getOrElse(defaultValue);
```

### 🔄 Function Utilities

```typescript
// Available on Function constructor
Function.identity(x);            // Returns x unchanged
Function.doNothing();            // No-op function
Function.compose(f, g);          // Function composition: g(f(x))
Function.negate(predicate);      // Negate boolean function
Function.promisify(fn);          // Convert callback to Promise
```

### 🎨 Any Utilities

```typescript
import { Any } from 'undumbed';

Any.isEmpty(value);              // Check if value is empty
Any.isNotEmpty(value);           // Check if value is not empty
Any.areEquals(a, b);             // Deep equality check
```

## 🔧 Advanced Usage

### Array Static Methods

```typescript
Array.range(5);                  // [0, 1, 2, 3, 4]
Array.range(5, i => i * 2);      // [0, 2, 4, 6, 8]
Array.zip([1, 2], ['a', 'b']);   // [[1, 'a'], [2, 'b']]
Array.cartesianProduct([1, 2], ['a', 'b']); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
```

### Object Static Methods

```typescript
Object.sequence({ 
  a: Promise.resolve(1), 
  b: Promise.resolve(2) 
});                              // Promise<{ a: 1, b: 2 }>
```

## 🎯 Why Undumbed?

- **Familiar API**: Extends native objects you already know
- **Functional Programming**: Immutable operations with chainable methods
- **Type Safety**: Full TypeScript support with proper type inference
- **Performance**: Optimized implementations with minimal overhead
- **Zero Dependencies**: No external dependencies to worry about

## 📄 License

MIT © [Methrat0n](https://github.com/Spyrals-IO)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- 🐛 [Report bugs](https://github.com/Spyrals-IO/Undumbed/issues)
- 💡 [Request features](https://github.com/Spyrals-IO/Undumbed/issues)
- 📖 [Documentation](https://github.com/Spyrals-IO/Undumbed)

---

**Made with ❤️ by the Spyrals team**