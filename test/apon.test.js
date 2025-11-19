const APON = require('../lib/apon.js');

describe('APON.parse', () => {
    it('should parse a simple key-value pair', () => {
        const aponText = 'name: John';
        const expected = { name: 'John' };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse an object with multiple properties', () => {
        const aponText = `
            name: John Doe
            age: 30
            city: New York
        `;
        const expected = { name: 'John Doe', age: 30, city: 'New York' };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse nested objects', () => {
        const aponText = `user: {
          name: Jane
          age: 25
        }`;
        const expected = { user: { name: 'Jane', age: 25 } };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse arrays of strings', () => {
        const aponText = `roles: [
          Admin
          User
        ]`;
        const expected = { roles: ['Admin', 'User'] };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should ignore comments', () => {
        const aponText = `
            # This is a comment
            name: Test
        `;
        const expected = { name: 'Test' };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse a root-level object enclosed in braces', () => {
        const aponText = `{
            name: John Doe
            age: 30
        }`;
        const expected = { name: 'John Doe', age: 30 };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse a root-level array', () => {
        const aponText = `[
            "apple"
            "banana"
            "cherry"
        ]`;
        const expected = ["apple", "banana", "cherry"];
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse a root-level array with nested objects', () => {
        const aponText = `[
            {
                name: John
            }
            {
                name: Jane
            }
        ]`;
        const expected = [{ name: 'John' }, { name: 'Jane' }];
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse nested arrays', () => {
        const aponText = `[
            [
                1
                2
            ]
            [
                3
                4
            ]
        ]`;
        const expected = [[1, 2], [3, 4]];
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse an empty root-level object', () => {
        const aponText = '{}';
        const expected = {};
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse an empty root-level array', () => {
        const aponText = '[]';
        const expected = [];
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should throw an error for unexpected content after a root object', () => {
        const aponText = `{
            name: Test
        }
        unexpected: content`;
        expect(() => APON.parse(aponText)).toThrow('Invalid APON format: Unexpected content after closing brace "}" at line 4');
    });

    it('should throw an error for unexpected content after a root array', () => {
        const aponText = `[
            1
        ]
        unexpected: content`;
        expect(() => APON.parse(aponText)).toThrow('Invalid APON format: Unexpected content after closing bracket "]" at line 4');
    });

    it('should throw an error for unexpected closing brace at top level', () => {
        const aponText = `
            name: Test
            }
        `;
        expect(() => APON.parse(aponText)).toThrow('Invalid APON format: Unexpected closing brace "}" at top level on line 3');
    });
});

describe('APON.stringify', () => {
    it('should stringify a simple object', () => {
        const obj = { name: 'John' };
        const expected = 'name: John';
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify an object with multiple properties', () => {
        const obj = { name: 'John Doe', age: 30 };
        const expected = 'name: John Doe\nage: 30';
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify nested objects', () => {
        const obj = { user: { name: 'Jane', active: true } };
        const expected = 'user: {\n  name: Jane\n  active: true\n}';
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify arrays of strings', () => {
        const obj = { roles: ['Admin', 'User'] };
        const expected = 'roles: [\n  Admin\n  User\n]';
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify a root-level array', () => {
        const obj = ['a', 'b', 'c'];
        const expected = '[\n  a\n  b\n  c\n]';
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify a root-level array with nested object blocks', () => {
        const obj = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 }
        ];
        const expected = `[
  {
    name: Alice
    age: 30
  }
  {
    name: Bob
    age: 25
  }
]`;
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should throw an error for non-object/array inputs', () => {
        expect(() => APON.stringify("a string")).toThrow('APON.stringify input must be an object or an array.');
        expect(() => APON.stringify(123)).toThrow('APON.stringify input must be an object or an array.');
        expect(() => APON.stringify(null)).toThrow('APON.stringify input must be an object or an array.');
    });
});

