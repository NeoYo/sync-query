import { isString } from "./type";

export function isStringParam(value) {
    return /^"[^"]+"$/.test(value);
}

export function extractStringValue(value) {
    return value.substr(1, value.length - 2)
}

/**
 * Refer: nuxt/utils
 * Format given url, append query to url query string
 *
 * @param  {string} url
 * @param  {string} query
 * @return {string}
 */
export function formatUrl(url, query) {
    let protocol
    const index = url.indexOf('://')
    if (index !== -1) {
        protocol = url.substring(0, index)
        url = url.substring(index + 3)
    } else if (url.startsWith('//')) {
        url = url.substring(2)
    }

    let parts = url.split('/')
    let result = (protocol ? protocol + '://' : '//') + parts.shift()

    let path = parts.filter(Boolean).join('/')
    let hash
    parts = path.split('#')
    if (parts.length === 2) {
        [path, hash] = parts
    }

    result += path ? '/' + path : ''

    if (query && JSON.stringify(query) !== '{}') {
        result += (url.split('?').length === 2 ? '&' : '?') + formatQuery(query)
    }
    result += hash ? '#' + hash : ''

    return result
}

/**
 * Refer: nuxt/utils
 * Transform data object to query string
 *
 * @param  {object} query
 * @return {string}
 */
export function formatQuery(query) {
    return Object.keys(query).sort().map((key) => {
        const val = query[key]
        if (val == null) {
            return ''
        }
        if (Array.isArray(val)) {
            return val.slice().map(val2 => [key, '=', val2].join('')).join('&')
        }
        return key + '=' + val
    }).filter(Boolean).join('&')
}

export const parseQuery = (queryString, handler = decodeURIComponent) => {
    const query = {}
    const pairs = queryString.split('&')
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=')
        query[handler(pair[0])] = handler(pair[1] || '')
    }
    return query
}

export const encodeQuery = (queryObject, handler:Function = encodeURIComponent) => {
    return Object.entries(queryObject)
        .filter(([key, value]) => typeof value !== 'undefined')
        .map(
            ([key, value]) =>
                handler(key) + (value != null ? '=' + handler(value as any) : '')
        )
        .join('&')
}

export const filterQuery = (
    queryString:string,
    handler:(key:string, value:string) => Boolean
) => {
    if (!isString(queryString)) {
        return '';
    }
    if (queryString.length === 0) {
        return '';
    }
    return queryString
        .split('&')
        .reduce(
            (acc, cur) => {
                const [key, value] = cur.split('=')
                if (handler(key, value)) {
                    acc.push(cur);
                }
                return acc;
            },
            []
        )
        .join('&');
}

