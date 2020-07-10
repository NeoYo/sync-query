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

## 引入

ES6 / Babel:
``` js
import { SyncQueryFactory } from "sync-query";
```

## 使用说明:

### `SyncQueryFactory`:

```js
@SyncQueryFactory(['searchInput', 'pagination'], 'fetch' )
export class MyComponent extends Component{
   // 注意 SyncQueryFactory 装饰器要放在离 MyComponent 最近的位置
   fetch() {
       // network fetch...
   }
}
```

## 已提供的方法:

 - `SyncQueryFactory(observedStates:string[], effect:string)`
   observedState： 传一个数组，state 中对应 key 的值会被监听
   effect: 监听到变化时，触发 effect 方法
   returns 一个新的组件

## License

MIT
