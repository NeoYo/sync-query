<div align="center">
  <h1>sync-query</h1>

  ❄️

  同步 React state 和 URL 路由参数
</div>

<hr />

用于React state 和路由参数同步的装饰器

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
}
```

## 已提供的方法:
 - `SyncQueryFactory(observedState, effect)`
   observedState： 传一个树
 returns the difference of the original and updated objects

 - ``

## License

MIT
