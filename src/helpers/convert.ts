import { parseQuery, isStringParam, extractStringValue, encodeQuery } from "./url";
import { filterExist, map } from "./util";

// TODO: UnitTest for private variable https://github.com/jhnns/rewire
export function queryToState(query:string, stateList:string[]) {
    if (query == null || query.length === 0 || stateList.length === 0) {
        return {};
    }
    const origin = parseQuery(query);
    return Object.keys(origin)
        .filter((value) => (stateList.indexOf(value)) > -1)
        .reduce((obj, key) => {
            const parsedVal = parseParam(origin[key]);
            parsedVal && (obj[key] = parsedVal);
            return obj;
        }, {});
}

export function stateToQuery(state:Object) {
    if (state == null) {
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
