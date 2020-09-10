export declare function parseParam(value: any): any;
export declare type IQueryParser = {
    [key: string]: (string: any) => any;
};
export declare function queryToState(query: string, stateList?: string[], parser?: IQueryParser): {};
export declare type IQueryStringify = {
    [key: string]: (any: any) => any;
};
export declare function stateToQuery(state: Object, stringify?: IQueryStringify): string;
