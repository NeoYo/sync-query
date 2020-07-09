import { pick, difference } from "../helpers/util";
import { queryToState, stateToQuery } from "../helpers/convert";
import { parseQuery, filterQuery } from "../helpers/url";

export function syncQueryCb() {
    return function (target: any, propertyKey: string) {
        target.callback = propertyKey;
    };
}

const __SYNC_QUERY_DIFF_IGNORE__ = '__SYNC_QUERY_DIFF_IGNORE__';

export function SyncQueryFactory(stateList: string[], callback?:string) {
    return function(WrappedComponent) {
        return syncQueryHOC(WrappedComponent, stateList, callback);
    }
}

/**
 * syncQueryHOC
 * @param WrappedComponent 
 * @param stateList states are observed
 * @param callback callback would be called when state difference is detected
 */
export function syncQueryHOC(WrappedComponent, stateList: string[], callback?:string) : any{
    return class Enhancer extends WrappedComponent {
        constructor(param) {
            super(param);
            this.state = {
                ...this.state,
                ...this.getStateFromURL(stateList),
            }
            this.reBindCallback();
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
            if (typeof this.callback === 'string'
                && this.callback.length > 0
            ) {
                if (typeof this.callback === 'string'
                    && this.callback.length > 0) { 
                    console.warn('callback will be replaced by this.callback');
                }
                callback = this.callback;
            }
            if (callback == null) {
                return;
            }
            if (typeof super[callback] !== 'function') {
                console.error('sync-query: callback must be react component method name or be null');
                return;
            }
            const clone = Object.create(this);
            clone.setState = (val) => {
                this.setState({
                    ...val,
                    __SYNC_QUERY_DIFF_IGNORE__: true,
                });
            }
            // super[callback] is super.prototype[callback], so it is not bound with _super.
            this[callback] = super[callback].bind(clone);
        }
        componentDidUpdate(prevProps, prevState) {
            if (this.state[__SYNC_QUERY_DIFF_IGNORE__] === true) {
                return (
                    super.componentDidUpdate &&
                    super.componentDidUpdate(prevProps, prevState)
                );
            }
            const pickedPrevState = pick(prevState, stateList);
            const pickedState = pick(this.state, stateList);
            const diffState = difference(pickedPrevState, pickedState);
            let isDiff = Object.keys(diffState).length > 0;
            if (isDiff) {
                this[callback] && typeof this[callback] === 'function' && this[callback]();
                console.log('pickedState: ', pickedState);
                this.syncStateToURL(pickedState);
            }
            return (
                super.componentDidUpdate &&
                super.componentDidUpdate(prevProps, prevState)
            );
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
