import { parseQuery, encodeQuery } from "./url";
import { filterExist, map } from "./util";
import { isString, isObject } from "./type";

export function queryToState(query:string, stateList?:string[]) {
    if (!isString(query) || query.length === 0) {
        return {};
    }
    const origin = parseQuery(query);
    return Object.keys(origin)
        .filter((value) => (
            stateList == null ? true : stateList.indexOf(value)) > -1
        )
        .reduce((obj, key) => {
            const parsedVal = parseParam(origin[key]);
            parsedVal != null && (obj[key] = parsedVal);
            return obj;
        }, {});
}

export function stateToQuery(state:Object) {
    if (!isObject(state)) {
        return '';
    }
    const filterState = filterExist(state);
    const query = encodeQuery(
        map(
            filterState,
            function(value) {
                return JSON.stringify(value);
            }
        )
    );
    return query;
}

export function parseParam(value) {
    let parsed;
    try {
        parsed = JSON.parse(value);
    } catch (error) {
        // console.warn(`parseParam error: ${ value } can't be JSON.parse. Error: ${ error }. Type: ${ typeof value }. `);
    }
    return parsed;
}
