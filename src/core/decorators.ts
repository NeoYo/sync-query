import { pick, debounce } from "../helpers/util";
import { queryToState, stateToQuery, IQueryParser, IQueryStringify } from "../helpers/convert";
import { filterQuery } from "../helpers/url";
import { isArray, isObject } from "../helpers/type";
import { deepEqual } from "../helpers/deepEqual";

export function syncQueryCb(callbackDeps?:string[]) {
    return function (target: any, propertyKey: string) {
        target.callbackName = propertyKey;
        if (isArray(callbackDeps) && callbackDeps.length > 0) {
            target.callbackDeps = callbackDeps;
        }
    };
}

const __SYNC_QUERY_DIFF_IGNORE__ = '__SYNC_QUERY_DIFF_IGNORE__';

export function SyncQueryFactory(stateList: string[], callbackName?:string, config?:SyncQueryConfig) {
    return function(WrappedComponent) {
        return syncQueryHOC(WrappedComponent, stateList, callbackName, config);
    }
}

type SyncQueryConfig = {
    wait: number,                           // 函数防抖的等待时间， 单位 ms
    callbackDeps?: string[],                // callbackDeps 存放 state key 的数组，监听到 state 中对应key 的 value 变化时，会调用 callback（网络请求等）
                                            // PS: callbackDeps 没有传入时，默认监听的内容等于 stateList
    parser?: IQueryParser,                  // 解析器：用于将路由参数 query 解析到 state，默认是 JSON.parse
    stringify?: IQueryStringify,            // 生成器：用于生成 state 对应的 query 字符串，默认是 JSON.stringify
}

/**
 * syncQueryHOC
 * @param WrappedComponent 
 * @param stateList states are observed
 * @param callbackName callbackName would be called when state difference is detected
 * @param config SyncQueryConfig
 */
export function syncQueryHOC(WrappedComponent, stateList: string[], callbackName?:string, config?:SyncQueryConfig) : any{    
    if (!isObject(config)) {
        config = {
            wait: 300,
        }
    } else {
        config = {
            wait: 300,
            ...config,
        }
    }
    return class Enhancer extends WrappedComponent {
        private prevStateCache = {};
        constructor(param) {
            super(param);
            this.state = {
                ...this.state,
                ...this.getStateFromURL(stateList),
            }
            this.prevStateCache = this.state;
            this.reBindCallback();
            this.stateDiffEffect = debounce(this.stateDiffEffect, config.wait).bind(this);
        }
        private getStateFromURL(stateList:string[]) {
            const query = location.href.split('?')[1];
            if (query == null) {
                return;
            }
            return queryToState(query, stateList, config.parser);
        }
        private syncStateToURL(state:Object) {
            const [locationAddress, oldQuery] = location.href.split('?');
            const restQuery = filterQuery(oldQuery, (key, value) => (stateList.indexOf(key) === -1))
            const query =  stateToQuery(state, config.stringify);
            const href = `${locationAddress}?${query}&${restQuery}`;
            location.href = href;
        }
        private reBindCallback() {
            this.callbackName = this.callbackName || callbackName;            
            if (this.callbackName == null) {
                return;
            }
            if (typeof super[this.callbackName] !== 'function') {
                console.error('sync-query: callback must be react component method name!!! Tips:  SyncQueryFactory and syncQueryHOC must be closest with Component Class');
                return;
            }
            const clone = Object.create(this);
            clone.setState = (updater, callback) => {
                this.setState(updater, callback, true);
            }
            // super[callbackName] is super.prototype[callbackName], so it is not bound with _super.
            this[this.callbackName] = super[this.callbackName].bind(clone);
            this.callbackDeps = this.callbackDeps || config.callbackDeps;
        }
        componentDidUpdate(prevProps, prevState) {
            if (this.state[__SYNC_QUERY_DIFF_IGNORE__] === true) {
                return (
                    super.componentDidUpdate &&
                    super.componentDidUpdate(prevProps, prevState)
                );
            }
            this.stateDiffEffect(this.state);
            return (
                super.componentDidUpdate &&
                super.componentDidUpdate(prevProps, prevState)
            );
        }
        private stateDiffEffect(state) {
            const prevState = this.prevStateCache;
            if (prevState == null && state == null) {
                console.error('sync-query: stateDiffEffect could not be null');
                return;
            }
            // stateList diff
            const pickedPrevState = pick(prevState, stateList);
            const pickedState = pick(state, stateList);
            const isDiff = !deepEqual(pickedPrevState, pickedState);
            if (isDiff) {
                this.syncStateToURL(pickedState);
            }
            // callbackDeps diff
            const callbackDeps = this.callbackDeps;            
            if (callbackDeps == null) {
                isDiff && this[this.callbackName] && typeof this[this.callbackName] === 'function' && this[this.callbackName]();
            } else {
                const pickedPrevState = pick(prevState, callbackDeps);
                const pickedState = pick(state, callbackDeps);
                const isDiff = !deepEqual(pickedPrevState, pickedState);
                isDiff && this[this.callbackName] && typeof this[this.callbackName] === 'function' && this[this.callbackName]();
            }
            this.prevStateCache = state;
        }
        setState(updater, callback?:() => void, diffIgnore?:boolean) {
            // Ref: https://zh-hans.reactjs.org/docs/react-component.html#setstate
            if (typeof updater === 'object') {
                return super.setState(
                    {
                        ...updater,
                        [__SYNC_QUERY_DIFF_IGNORE__]: diffIgnore,
                    },
                    callback,
                );
            }
            if (typeof updater === 'function') {
                return super.setState(
                    function (state, props) {
                        return {
                            ...updater(state, props),
                            [__SYNC_QUERY_DIFF_IGNORE__]: diffIgnore,
                        }
                    },
                    callback,
                );
            }
            return super.setState(updater, callback);
        }
    }
}
