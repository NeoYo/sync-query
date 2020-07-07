import { pick, difference } from "../helpers/util";
import { getStateFromURL, syncStateToURL } from "../helpers/convert";

export function syncQueryCb() {
    return function (target: any, propertyKey: string) {
        target.callback = propertyKey;
    };
}

const __STATE_DIFF_AOP_IGNORE__ = '__STATE_DIFF_AOP_IGNORE__';

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
export function syncQueryHOC(WrappedComponent, stateList?: string[], callback?:string) : any{
    return class Enhancer extends WrappedComponent {
        constructor(param) {
            super(param);
            this.state = {
                ...this.state,
                ...getStateFromURL(),
            }
            this.reBoundCallback();
        }
        reBoundCallback() {
            if (typeof this.callback === 'string'
                && this.callback.length > 0
            ) {
                if (typeof this.callback === 'string'
                    && this.callback.length > 0) { 
                    console.warn('callback will be replaced by this.callback');
                }
                callback = this.callback;
            }
            const clone = Object.create(this);
            let self = this;
            clone.setState = function (val) {
                self.setState({
                    ...val,
                    __STATE_DIFF_AOP_IGNORE__: true,
                });
            }
            // super[callback] is super.prototype[callback], so it is not bound with _super.
            this[callback] = super[callback].bind(clone);
        }
        componentDidUpdate(prevProps, prevState) {
            if (this.state[__STATE_DIFF_AOP_IGNORE__] === true) {
                return super.componentDidUpdate(prevProps, prevState);
            }
            const pickedPrevState = pick(prevState, stateList);
            const pickedState = pick(this.state, stateList);
            const diffState = difference(pickedPrevState, pickedState);
            let isDiff = Object.keys(diffState).length > 0;
            if (isDiff) {
                this[callback]();
                console.log('pickedState: ', pickedState);
                syncStateToURL(pickedState)
            }
            return super.componentDidUpdate(prevProps, prevState);
        }
        setState(state) {
            // TODO: add setState callback
            // TODO: add setState firstParam when callback https://zh-hans.reactjs.org/docs/react-component.html#setstate
            if (state[__STATE_DIFF_AOP_IGNORE__] === true) {
                // console.log('__STATE_DIFF_AOP_IGNORE__: true...');
                return super.setState(state);
            } else {
                return super.setState({
                    ...state,
                    __STATE_DIFF_AOP_IGNORE__: false,
                });
            }
        }
    }
}
