import { isArray, isObject, isString, isFunction } from "../../src/helpers/type";

test('isArray', () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
})

test('isObject', () => {
    expect(isObject([])).toBe(false);
    expect(isObject({})).toBe(true);
})

test('isString', () => {
    expect(isString('')).toBe(true);
    expect(isString({})).toBe(false);
})

test('isFunction', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(function test() {})).toBe(true);
    expect(isFunction(() => {})).toBe(true);
})
