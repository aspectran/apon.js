# APON.js

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A lightweight, zero-dependency JavaScript library for handling APON (Aspectran Parameters Object Notation). This library provides an intuitive API to parse APON strings into JavaScript objects and stringify JavaScript objects back into APON strings, similar to the native `JSON.parse()` and `JSON.stringify()` APIs.

This library is designed to bring the readability and convenience of APON to the web environment, making it easy to manage configurations or structured data on the client-side.

**[Live Demo &raquo;](https://aspectran.github.io/apon.js/)**

## Features

- **Parse APON**: Convert any valid APON string into a standard JavaScript object.
- **Stringify Objects**: Convert JavaScript objects into clean, readable APON strings.
- **Zero Dependencies**: Written in plain JavaScript (ES6) for maximum compatibility.
- **APON Spec Compliant**: Accurately handles comments, nested structures, arrays, multi-line text, and automatic quoting based on the official Java implementation.
- **Lightweight**: A single file with a small footprint, perfect for web applications.

## Installation

*This library is not yet published to npm. Once published, you will be able to install it via:*

```bash
npm install apon
```

For now, you can include `apon.js` directly in your HTML file:

```html
<script src="apon.js"></script>
```

## API

### `APON.parse(text)`

Parses an APON string, constructing the JavaScript value or object described by the string.

- **`text`**: `string` - The string to parse as APON.
- **Returns**: `object` - The object corresponding to the given APON text.

**Example:**

```javascript
const aponText = `
# User profile
user: {
  name: "John Doe"
  age(int): 30
  active: true
  roles: [
    Admin
    Editor
  ]
}
`;

const userObject = APON.parse(aponText);

console.log(userObject);
// { user: { name: 'John Doe', age: 30, active: true, roles: [ 'Admin', 'Editor' ] } }
```

### `APON.stringify(obj, [options])`

Converts a JavaScript object into an APON formatted string.

- **`obj`**: `object` - The object to convert. The top-level value must be a non-array object.
- **`options`** (optional): `object` or `number` - An object that contains options, or the number of spaces to use for indentation.
  - **`indent`**: `string` - The string to use for indentation (e.g., `'  '` or `'	'`). Defaults to `'  '`.

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

// Stringify with an indent of 2 spaces
const aponString = APON.stringify(myObject, { indent: '  ' });

console.log(aponString);
/*
database: {
  host: localhost
  port: 5432
  users: [
    admin
    readonly
  ]
}
debugMode: false
*/
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.