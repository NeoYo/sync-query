import { parseQuery, isStringParam, extractStringValue, encodeQuery } from "./url";
import { filterExist, map } from "./util";

// TODO: UnitTest for private variable https://github.com/jhnns/rewire
function queryToState(query:string) {
    if (query == null || query.length === 0) {
        return {};
    }
    const origin = (window as any).origin = parseQuery(query);
    const obj = {};
    Object.keys(origin).forEach(key => {
        obj[key] = parseType(origin[key]);
    })
    return obj;
}

function stateToQuery(state:Object) {
    if (state == null) {
        return '';
    }
    const filterState = filterExist(state);
    return encodeQuery(
        map(
            filterState,
            function(value) {
                return JSON.stringify(value);
            }
        )
    );
}

export function getStateFromURL() {
    const query = location.href.split('?')[1];
    if (query == null) {
        return;
    }
    return queryToState(query);
}

export function syncStateToURL(state:Object) {
    const locationAddress = location.href.split('?')[0];
    console.log('state: ', state);
    const query = stateToQuery(state);
    console.log(query);
    const href = locationAddress + '?' + query;
    location.href = href;
}

function parseType(value) {
    if (typeof value === 'string' &&  value.length === 0) {
        return;
    }
    if (isStringParam(value)) {
        return extractStringValue(value);
    }
    // TODO: change to JSON.parse(value, cb)
    return JSON.parse(value);
    // Unit Test
    // 字符串
    // null
    // undefined
    // boolean
    // number
    // string
    // object
    // symbol (ES6)
}
