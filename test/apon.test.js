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

    it('should throw an error for non-object inputs', () => {
        expect(() => APON.stringify("a string")).toThrow('APON.stringify input must be a non-array object.');
        expect(() => APON.stringify([1, 2, 3])).toThrow('APON.stringify input must be a non-array object.');
    });
});

