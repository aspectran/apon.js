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

    it('should parse inline comments', () => {
        const aponText = 'name: John Doe # this is a comment';
        const expected = { name: 'John Doe' };
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

    it('should parse SINGLE_LINE style', () => {
        const aponText = 'name: John Doe, age: 30, city: New York';
        const expected = { name: 'John Doe', age: 30, city: 'New York' };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should parse COMPACT style', () => {
        const aponText = '{name:John,age:30,roles:[Admin,User]}';
        const expected = { name: 'John', age: 30, roles: ['Admin', 'User'] };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should handle complex unquoted values', () => {
        const aponText = 'key: value with {curly and [square open';
        const expected = { key: 'value with {curly and [square open' };
        expect(APON.parse(aponText)).toEqual(expected);
    });

    it('should throw an error for unexpected content after a root object', () => {
        const aponText = `{
            name: Test
        }
        unexpected: content`;
        expect(() => APON.parse(aponText)).toThrow('Invalid APON format: Unexpected content after closing brace "}" of root object');
    });

    it('should throw an error for unexpected content after a root array', () => {
        const aponText = `[
            1
        ]
        unexpected: content`;
        expect(() => APON.parse(aponText)).toThrow('Invalid APON format: Unexpected content after closing bracket "]" of root array');
    });
});

describe('APON.stringify', () => {
    const obj = {
        name: 'John Doe',
        age: 30,
        roles: ['Admin', 'User'],
        address: { city: 'New York', zip: 10001 }
    };

    it('should stringify in PRETTY style (default)', () => {
        const expected = `name: John Doe
age: 30
roles: [
  Admin
  User
]
address: {
  city: New York
  zip: 10001
}`;
        expect(APON.stringify(obj)).toBe(expected);
    });

    it('should stringify in SINGLE_LINE style', () => {
        const expected = 'name: John Doe, age: 30, roles: [ Admin, User ], address: { city: New York, zip: 10001 }';
        expect(APON.stringify(obj, { style: 'SINGLE_LINE' })).toBe(expected);
    });

    it('should stringify in COMPACT style', () => {
        const expected = 'name:John Doe,age:30,roles:[Admin,User],address:{city:New York,zip:10001}';
        expect(APON.stringify(obj, { style: 'COMPACT' })).toBe(expected);
    });

    it('should convert text type to string in non-PRETTY styles', () => {
        const textObj = { desc: "line1\nline2" };
        expect(APON.stringify(textObj, { style: 'SINGLE_LINE' })).toBe('desc: "line1\\nline2"');
    });

    it('should throw an error for non-object/array inputs', () => {
        expect(() => APON.stringify("a string")).toThrow('APON.stringify input must be an object or an array.');
        expect(() => APON.stringify(123)).toThrow('APON.stringify input must be an object or an array.');
        expect(() => APON.stringify(null)).toThrow('APON.stringify input must be an object or an array.');
    });
});
