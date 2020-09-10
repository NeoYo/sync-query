import { IQueryParser, IQueryStringify } from "../helpers/convert";
export declare function syncQueryCb(callbackDeps?: string[]): (target: any, propertyKey: string) => void;
export declare function SyncQueryFactory(stateList: string[], callbackName?: string, config?: SyncQueryConfig): (WrappedComponent: any) => any;
declare type SyncQueryConfig = {
    wait?: number;
    callbackDeps?: string[];
    parser?: IQueryParser;
    stringify?: IQueryStringify;
    disableAutoSync?: boolean;
};
export interface SyncQueryHost {
    triggerSync: any;
}
/**
 * syncQueryHOC
 * @param WrappedComponent
 * @param stateList states are observed
 * @param callbackName callbackName would be called when state difference is detected
 * @param config SyncQueryConfig
 */
export declare function syncQueryHOC(WrappedComponent: any, stateList: string[], callbackName?: string, config?: SyncQueryConfig): any;
export {};
