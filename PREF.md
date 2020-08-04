# JS体积优化

## lodash

由于使用 lodash 的比较函数，gzip 多了 30.41kb

![](./assets/lodash-analyzer.jpg)

### lodash-es 优化

![](./assets/lodash-es.jpg)

lodash 按需引入，从 30.41kb 降到 5.62kb

Ref: https://itnext.io/lodash-es-vs-individual-lodash-utilities-size-comparison-676f14b07568

Ref: https://stackoverflow.com/questions/1068834/object-comparison-in-javascript

### 不用 lodash

![](./assets/no-dependence.jpg)

[deepEqual](./src/helpers/deepEqual.js)，只需要 0.5kb
