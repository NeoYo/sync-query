<div align="center">
  <h1>sync-query</h1>

  ❄️

  同步 React state 和 URL 路由参数
</div>

<hr />

用于React state 和路由参数同步的 HOC

## 安装

`yarn add sync-query`

`npm i --save sync-query`

## 使用说明

### TypeScript 装饰器

```js
import { SyncQueryFactory, syncQueryCb } from "sync-query";

@SyncQueryFactory(['searchInput', 'pagination']) // 监听到 searchInput 或 pagination 变化时同步到 URL query
export class MyComponent extends Component {

    @syncQueryCb(['searchInput']) // 监听到 searchInput 变化时调用 fetch 函数
    fetch() {
        // network fetch...
    }
}
```

### ES6 HOC

``` js
import { syncQueryHOC } from "sync-query";

export class MyComponent extends Component {
    fetch() {
        // network fetch...
    }
}

export const MyComponentEnhance = 
    syncQueryHOC(
        MyComponent,
        ['searchInput', 'pagination'], // 监听到 searchInput 或 pagination 变化时同步到 URL query
        'fetch',
        {
            callbackDeps: ['searchInput'], // 监听到 searchInput 变化时调用 fetch 函数
            wait: 600, // 函数防抖，600ms
        }
    );
```


> 注意: SyncQueryFactory 装饰器工厂 和 syncQueryHOC 要放在离 MyComponent 最近的位置

## 提供的方法:

 - `SyncQueryFactory(observedStates:string[], effect:string)`
   observedState： 传一个数组，state 中对应 key 的值会被监听
   effect: 监听到变化时，触发 effect 方法
   returns 一个新的组件

## License

MIT
