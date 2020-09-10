/**
 * Refer: nuxt/utils
 * Format given url, append query to url query string
 *
 * @param  {string} url
 * @param  {string} query
 * @return {string}
 */
export declare function formatUrl(url: any, query: any): string;
/**
 * Refer: nuxt/utils
 * Transform data object to query string
 *
 * @param  {object} query
 * @return {string}
 */
export declare function formatQuery(query: any): string;
export declare const parseQuery: (queryString: any, handler?: typeof decodeURIComponent) => {};
export declare const encodeQuery: (queryObject: any, handler?: Function) => string;
export declare const filterQuery: (queryString: string, handler: (key: string, value: string) => Boolean) => string;
