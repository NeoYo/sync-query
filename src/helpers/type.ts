
export function isArray(value) {
    return Object.prototype.toString.call(value) == "[object Array]";
}

export function isObject(value) {
    return (Object.prototype.toString.call(value)) == "[object Object]";
}

export function isString(value) {
    return Object.prototype.toString.call(value) == "[object String]";
}

export function isFunction(value) {
    return Object.prototype.toString.call(value) == "[object Function]";
}
