# APON.js

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A lightweight, zero-dependency JavaScript library for handling APON (Aspectran Parameters Object Notation). This library provides an intuitive API to parse APON strings into JavaScript objects and stringify JavaScript objects back into APON strings, similar to the native `JSON.parse()` and `JSON.stringify()` APIs.

This library is designed to bring the readability and convenience of APON to the web environment, making it easy to manage configurations or structured data on the client-side.

**[Live Demo &raquo;](https://aspectran.github.io/apon.js/)**

## Features

- **Parse APON**: Convert any valid APON string into a standard JavaScript object. Supports `SINGLE_LINE` and `COMPACT` styles as well as multi-line `PRETTY` format.
- **Stringify Objects**: Convert JavaScript objects into clean, readable APON strings with multiple output styles.
- **Zero Dependencies**: Written in plain JavaScript (ES6) for maximum compatibility.
- **APON Spec Compliant**: Accurately handles inline comments, nested structures, arrays, multi-line text, and automatic quoting based on the official Java implementation.
- **Lightweight**: A single file with a small footprint, perfect for web applications.

## Installation

```bash
npm install apon
```

For web environments, you can include `lib/apon.js` directly in your HTML file:

```html
<script src="lib/apon.js"></script>
```

## API

### `APON.parse(text)`

Parses an APON string, constructing the JavaScript value or object described by the string.

- **`text`**: `string` - The string to parse as APON.
- **Returns**: `object` - The object corresponding to the given APON text.

**Example:**

```javascript
// Supports PRETTY, SINGLE_LINE, and COMPACT styles
const aponText = 'name: John Doe, age: 30 # inline comment';
const userObject = APON.parse(aponText);

console.log(userObject);
// { name: 'John Doe', age: 30 }
```

### `APON.stringify(obj, [options])`

Converts a JavaScript value to an APON formatted string.

- **`obj`**: `object` - The value to convert. Supports objects and arrays.
- **`options`** (optional): `object` or `number` - An object that contains options, or the number of spaces to use for indentation.
  - **`indent`**: `string` - The string to use for indentation. Defaults to `'  '`.
  - **`style`**: `string` - The output style: `'PRETTY'`, `'SINGLE_LINE'`, or `'COMPACT'`. Defaults to `'PRETTY'`.

**Example:**

```javascript
const myObject = {
  database: {
    host: "localhost",
    port: 5432,
    users: ["admin", "readonly"]
  },
  debugMode: false
};

// Stringify in PRETTY style (default)
console.log(APON.stringify(myObject));

// Stringify in SINGLE_LINE style
console.log(APON.stringify(myObject, { style: 'SINGLE_LINE' }));
// database: { host: localhost, port: 5432, users: [ admin, readonly ] }, debugMode: false

// Stringify in COMPACT style
console.log(APON.stringify(myObject, { style: 'COMPACT' }));
// database:{host:localhost,port:5432,users:[admin,readonly]},debugMode:false
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.