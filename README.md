<div align="center">
  <h1>sync-query</h1>

  ❄️

  使用 React 高阶组件 和 ES6继承，实现将 React state 自动同步到 URL query 
</div>

<hr />

[English](./README-English.md)

## 快手上手

![](https://ae01.alicdn.com/kf/Ude8ccc24d81a43c9b893883e184559acC.jpg)

![](https://ae01.alicdn.com/kf/U89af580f9d93419cbab4ac55ae16a0d01.jpg)

^_^ 这是一个在 antd-design 里使用该库的实例

只需要 3 行代码！

```js
// import
import { syncQueryHOC } from "sync-query";
// use syncQueryHOC
const MyComponentEnhance = syncQueryHOC(MyComponent, ['searchInput', 'pagination'], 'fetch');
<MyComponentEnhance></MyComponentEnhance>
//...
```

[更多关于这个例子，请点击这里](https://github.com/NeoYo/sync-query/tree/master/examples/antd/antd-demo)

一旦我们这样做了，就拥有了需求场景提到的功能。

## 实现原理

![](https://s3.ax1x.com/2021/02/23/yLklF0.png)

- 在界面初始化时，从 URL query param 获取参数，初始化 this.state
- 在每次 componentDidUpdate 时，深对比 state，同步到 URL query param
- 这部分功能，实际上是每个界面独立的，通过 ES6 继承，提取到 父类

## 基础功能

- 自动同步 react state 到 url query (URLSearchParam)
- 自动调用回调函数（比如网络请求等），当 react state 发生变化时.
- 自动从 url query (URLSearchParam) ，初始化 react state 
- [零依赖](./PREF.md)，只有 2.8kb gzipped 大小 （[查看JS体积优化过程](./PREF.md)）

- 支持 TypeScript 装饰器 [核心代码](./src/core/decorators.ts)
## 安装

`yarn add sync-query`

`npm i --save sync-query`

## 使用说明

### Use TypeScript Decorator

```typescript
import { SyncQueryFactory, syncQueryCb } from "sync-query";

@SyncQueryFactory(['searchInput', 'pagination']) // 监听到 searchInput 或 pagination 变化时同步到 URL query
export class MyComponent extends Component {
    this.state = {
        searchInput: 'hello world',
        pagination: {
        },
    }
    @syncQueryCb(['searchInput']) // 监听到 searchInput 变化时调用 fetch 函数
    fetch() {
        // network fetch...
    }
}
```

### Use ES6 React HOC

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

## 其他说明

### 手动同步

该库会自动存储 state 到 url query，同时触发 callback 函数

关闭的方法是，在类装饰器配置中增加 `disableAutoSync`

手动同步的方法是 `(this as SyncQueryHost).triggerSync)`,

`triggerSync` 该方法的调用，会同步state到路由参数

示例代码如下：

```typescript
@SyncQueryFactory(
    ['pagination', 'searchInput'],
    null,
    {
        disableAutoSync: true
    }
)
class MyComponent extends Component {
    onHandlePageChange(current) {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    current,
                },
            },
            this.fetchTable
        );
    }
    fetchTable() {
        (this as any).triggerSync();
        // fetch network...
    }
}
```

> 注意： (this as any).triggerSync() 要在 componentDidMount 和之后的声明周期才被初始化。

## API

### syncQueryHOC

接收一个 React 组件，返回带有同步 state 到路由参数功能的组件

syncQueryHOC(WrappedComponent, stateList: string[], callbackName?:string, config?:SyncQueryConfig): EnhanceComponent

- WrappedComponent: 被装饰的原始组件
- stateList: 传一个数组，state 中对应 key 的值会被监听
- callbackName?: 监听到变化时，触发 effect 方法
- config?: SyncQueryConfig
    ```typescript
    type SyncQueryConfig = {
        wait: number,                           // 函数防抖的等待时间， 单位 ms
        callbackDeps?: string[],                // callbackDeps 存放 state key 的数组，监听到 state 中对应key 的 value 变化时，会调用 callback（网络请求等）
                                                // callbackDeps 没有传入时，默认监听的内容等于 stateList
        parser?: IQueryParser,                  // 解析器：用于将路由参数 query 解析到 state，默认是 JSON.parse
        stringify?: IQueryStringify,            // 生成器：用于生成 state 对应的 query 字符串，默认是 JSON.stringify
    }
    ```

### SyncQueryFactory

SyncQueryFactory 装饰器工厂， 在 typescript 中使用

SyncQueryFactory(stateList: string[], callbackName?:string, config?:SyncQueryConfig) 

> 注意 类装饰器工厂 SyncQueryFactory 和 方法装饰器 syncQueryCb 可以配合使用， 高阶组件 syncQueryHOC 与前两者尽量避免共用。

- stateList: 传一个数组，state 中对应 key 的值会被监听
- callbackName?: 监听到变化时，触发 effect 方法
- config?: SyncQueryConfig
    ```typescript
    type SyncQueryConfig = {
        wait: number,                           // 函数防抖的等待时间， 单位 ms
        callbackDeps?: string[],                // callbackDeps 存放 state key 的数组，监听到 state 中对应key 的 value 变化时，会调用 callback（网络请求等）
                                                // callbackDeps 没有传入时，默认监听的内容等于 stateList
        parser?: IQueryParser,                  // 解析器：用于将路由参数 query 解析到 state，默认是 JSON.parse
        stringify?: IQueryStringify,            // 生成器：用于生成 state 对应的 query 字符串，默认是 JSON.stringify
    }
    ```

代码实现如下：

```typescript
function SyncQueryFactory(stateList: string[], callbackName?:string, config?:SyncQueryConfig) {
    return function(WrappedComponent) {
        return syncQueryHOC(WrappedComponent, stateList, callbackName, config);
    }
}
```

### syncQueryCb

syncQueryCb 方法装饰器，与 SyncQueryFactory 配合使用

syncQueryCb(callbackDeps?:string[])

- callbackDeps?: string[]  callbackDeps 存放 state key 的数组，监听到 state 中对应key 的 value 变化时，会调用 callback（网络请求等）

使用示例： 

```typescript
import { SyncQueryFactory, syncQueryCb } from "sync-query";

@SyncQueryFactory(['searchInput', 'pagination']) // 监听到 searchInput 或 pagination 变化时同步到 URL query
export class MyComponent extends Component {

    @syncQueryCb(['searchInput']) // 监听到 searchInput 变化时调用 fetch 函数
    fetch() {
        // network fetch...
    }
}
```

## 需求场景

在后台管理中，界面常常会有几个筛选条件，在输入框填写、下拉框选择等，在填写完时，将服务端的数据拉取展示在表格中。

把填写的信息，保存到网址路由参数。那么分享的网址，就带了输入信息，这是比较方便的方式。

每个筛选条件输入值修改，触发路由参数更新。

当进入界面时，从路由参数获取 React state 的初始值。

实现如下图所示:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/914599a657cc44c9861e1f1b2b41b1d8~tplv-k3u1fbpfcp-watermark.image)

代码实现原理如下图：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/837cc0c049494d61ba74fcea3ea95e2f~tplv-k3u1fbpfcp-watermark.image)

该库的意义，在于把这部分逻辑，抽离封装出来，与每个界面自己的逻辑解耦

## License

MIT
