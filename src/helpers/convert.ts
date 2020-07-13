import { parseQuery, encodeQuery } from "./url";
import { filterExist, map } from "./util";
import { isString, isObject, isFunction } from "./type";

export function parseParam(value) {
    let parsed;
    try {
        parsed = JSON.parse(value);
    } catch (error) {
        console.error(`parseParam error: ${ value } can't be JSON.parse. Error: ${ error }. Type: ${ typeof value }. `);
    }
    return parsed;
}

export type IQueryParser = {
    [key:string]: (string) => any
};

export function queryToState(query:string, stateList?:string[], parser?:IQueryParser) {
    if (!isString(query) || query.length === 0) {
        return {};
    }
    const origin = parseQuery(query);
    return Object.keys(origin)
        .filter((value) => (
            stateList == null ? true : stateList.indexOf(value)) > -1
        )
        .reduce((obj, key) => {
            const parseParamFunc = isObject(parser) && isFunction(parser[key]) && parser[key] || parseParam;
            const parsedVal = parseParamFunc(origin[key]);
            parsedVal != null && (obj[key] = parsedVal);
            return obj;
        }, {});
}

function stringifyParam(value) {
    return JSON.stringify(value);
}

export type IQueryStringify = {
    [key:string]: (any) => any,
}

export function stateToQuery(state:Object, stringify?:IQueryStringify) {
    if (!isObject(state)) {
        return '';
    }
    const filterState = filterExist(state);
    const query = encodeQuery(
        map(
            filterState,
            (value, key) => {
                const stringifyParamFunc =
                    isObject(stringify) && isFunction(stringify[key]) && stringify[key] || stringifyParam;
                return stringifyParamFunc(value);
            }
        )
    );
    return query;
}
