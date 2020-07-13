import { pick, difference, debounce } from "../helpers/util";
import { queryToState, stateToQuery } from "../helpers/convert";
import { parseQuery, filterQuery } from "../helpers/url";
import { isArray, isObject } from "../helpers/type";

// @@TODO:自测
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
    wait: number,
    callbackDeps?: string[],
}

/**
 * syncQueryHOC
 * @param WrappedComponent 
 * @param stateList states are observed @@@ TODO: 增加自定义 state 与 URL 的转换
 * @param callbackName callbackName would be called when state difference is detected
 * @param config SyncQueryConfig
 */
export function syncQueryHOC(WrappedComponent, stateList: string[], callbackName?:string, config?:SyncQueryConfig) : any{    
    if (!isObject(config)) {
        config = {
            wait: 600,
        }
    } else {
        config = {
            wait: 600,
            ...config,
        }
    }
    return class Enhancer extends WrappedComponent {
        constructor(param) {
            super(param);
            this.state = {
                ...this.state,
                ...this.getStateFromURL(stateList),
            }
            this.reBindCallback();
            this.stateDiffEffect = debounce(this.stateDiffEffect, config.wait).bind(this);
        }
        private getStateFromURL(stateList:string[]) {
            const query = location.href.split('?')[1];
            if (query == null) {
                return;
            }
            return queryToState(query, stateList);
        }
        private syncStateToURL(state:Object) {
            const [locationAddress, oldQuery] = location.href.split('?');
            const restQuery = filterQuery(oldQuery, (key, value) => (stateList.indexOf(key) === -1))
            const query =  stateToQuery(state);
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
            // @@@TODO 修复 setState
            const clone = Object.create(this);
            clone.setState = (val) => {
                this.setState({
                    ...val,
                    __SYNC_QUERY_DIFF_IGNORE__: true,
                });
            }
            // super[callbackName] is super.prototype[callbackName], so it is not bound with _super.
            this[this.callbackName] = super[this.callbackName].bind(clone);
        }
        componentDidUpdate(prevProps, prevState) {
            if (this.state[__SYNC_QUERY_DIFF_IGNORE__] === true) {
                return (
                    super.componentDidUpdate &&
                    super.componentDidUpdate(prevProps, prevState)
                );
            }
            this.stateDiffEffect(prevState, this.state);
            return (
                super.componentDidUpdate &&
                super.componentDidUpdate(prevProps, prevState)
            );
        }
        private stateDiffEffect(prevState, state) {
            if (prevState == null && state == null) {
                console.error('sync-query: stateDiffEffect could not be null');
                return;
            }
            // stateList diff
            const pickedPrevState = pick(prevState, stateList);
            const pickedState = pick(state, stateList);
            const diffState = difference(pickedPrevState, pickedState);
            const isDiff = Object.keys(diffState).length > 0;
            if (isDiff) {
                this.syncStateToURL(pickedState);
            }
            // callbackDeps diff
            const callbackDeps = this.callbackDeps || config.callbackDeps;            
            if (callbackDeps == null) {
                isDiff && this[this.callbackName] && typeof this[this.callbackName] === 'function' && this[this.callbackName]();
            } else {
                const pickedPrevState = pick(prevState, callbackDeps);
                const pickedState = pick(state, callbackDeps);
                const diffState = difference(pickedPrevState, pickedState);
                const isDiff = Object.keys(diffState).length > 0;
                isDiff && this[this.callbackName] && typeof this[this.callbackName] === 'function' && this[this.callbackName]();
            }
        }
        // TODO: Unit Test Jest React
        setState(updater, callback?:() => void) {
            // Ref: https://zh-hans.reactjs.org/docs/react-component.html#setstate
            if (typeof updater === 'object') {
                return super.setState(
                    this.getLockedState(updater),
                    callback,
                );
            }
            if (typeof updater === 'function') {
                return super.setState(
                    function (state, props) {
                        return this.getLockedState(updater(state, props));
                    },
                    callback,
                );
            }
            return super.setState(updater, callback);
        }
        private getLockedState(state:object) {
            return {
                ...state,
                [__SYNC_QUERY_DIFF_IGNORE__]: state[__SYNC_QUERY_DIFF_IGNORE__] || false
            };
        }
    }
}
