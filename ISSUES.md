#  何时开始监听

- 实际遇到的问题是：首次操作，突然又发起请求，刷新界面

    在第一个 fetch，就注入 __SYNC_QUERY_DIFF_IGNORE__，会出现在 state(init)，fetch后得到的 state(fetchedFirst)，没有同步给 sync-query，这样任何触发 setState 的操作，比较的都是 state(init) 和 state(fetchedFirst)，都会再次触发 fetch

- 解决方案

    在 componentDidMount 内代码执行后，再给 fetch 注入 __SYNC_QUERY_DIFF_IGNORE__。
通常来说在 componentDidMount，开发者会手动 fetch，这个 fetch 是没有 __SYNC_QUERY_DIFF_IGNORE__的，所以 fetch 里面的 setState，仍能同步给 sync-query。

- 但是这里会遇到新的问题

    连续触发 2 次fetch

    fetch (__SYNC_QUERY_DIFF_IGNORE__ ×) => 同步给 sync-query, 同时触发 state diff => 再次触发 fetch (__SYNC_QUERY_DIFF_IGNORE__ √) => 停止

- 解决方案

    增加一个标志位 __SYNC_QUERY_CALLBACK_IGNORE__

    fetch (__SYNC_QUERY_CALLBACK_IGNORE__) => 同步给 sync-query, 同时触发 state diff => 不触发 fetch => 停止

# 基本实现原理

setState => componentDidUpdate => state diff => 触发 fetch
