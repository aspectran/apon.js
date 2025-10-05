# APON.js

A simple JavaScript library for handling APON (Aspectran Parameters Object Notation) in a web environment. This library provides methods to parse APON strings into JavaScript objects and stringify JavaScript objects into APON strings, similar to the native `JSON.parse()` and `JSON.stringify()` APIs.

This library was created based on the official Java implementation of APON in the Aspectran framework.

## Files

- `apon.js`: The core library file.
- `index.html`: A demo and testing page showing how to use the library.

## How to Use

1.  Include the `apon.js` library in your HTML file:

    ```html
    <script src="apon.js"></script>
    ```

2.  Use the global `APON` object to access the `parse()` and `stringify()` methods.

### APON.parse()

Converts an APON string into a JavaScript object.

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
// Expected output:
// { user: { name: 'John Doe', age: 30, active: true, roles: [ 'Admin', 'Editor' ] } }
```

### APON.stringify()

Converts a JavaScript object into an APON formatted string.

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
Expected output:

{
  database: {
    host: localhost
    port: 5432
    users: [
      admin
      readonly
    ]
  }
  debugMode: false
}

*/
```

## How to Test

Open the `index.html` file in a web browser. The results of parsing and stringifying example data will be logged to the browser's developer console, and the stringified output will also be displayed on the page.
