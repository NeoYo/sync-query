import * as _  from 'lodash';
import { isObject } from './type';
/**
 * Refer: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
 * @param object 
 * @param keys 
 */
export function pick(object, keys:string[]) {
    return filter(object, function(acc, cur, obj) {
        return keys.indexOf(cur) != -1;
    });
}

export function filter(obj, handler) {
    if (!isObject(obj)) {
        console.error(`Param ${obj} is not a object`);
        return {};
    }
    return Object.keys(obj).reduce((acc, cur) => {
        if (typeof handler != 'function') {
            handler = notNull;
        }
        if (handler(acc, cur, obj)) {
            return {
                ...acc,
                [cur]: obj[cur],
            };
        } else {
            return acc;
        }
    }, {});
}

function notNull(tarket, key, obj) {
    return obj[key] != null;
}

function exist(tarket, key, obj) {
    if (typeof obj[key] == 'boolean') {
        return true;
    } else {
        return Boolean(obj[key]);
    }
}

export function filterExist(obj:Object) {
    return filter(obj, exist);
}

export function map(obj, func) {
    if (!isObject(obj)) {
        console.error(`Param ${obj} is not a object`);
        return {};
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = func(obj[key]);
        return acc;
    }, {});
}

/**
 * TODO: Zero dependency
 * Ref: https://gist.github.com/Yimiprod/7ee176597fef230d1451
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}

export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(
            function() {
                func.apply(context, args)
            },
            wait
        )
    }
}
