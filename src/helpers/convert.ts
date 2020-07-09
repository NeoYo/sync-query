import { parseQuery, encodeQuery } from "./url";
import { filterExist, map, filter } from "./util";

export function queryToState(query:string, stateList?:string[]) {
    if (query == null || query.length === 0) {
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

export function mergeQuery(state:Object, stateList:string[], oldQuery:string) {
    const wholeQueryObj = parseQuery(oldQuery, value => value);
    const otherQueryObj = filter(
        wholeQueryObj, (acc, cur, obj) => {
            return stateList.indexOf(cur) === -1;
        }
    );
    const otherQueryString = encodeQuery(otherQueryObj, value => value)
        

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
