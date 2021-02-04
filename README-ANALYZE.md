

> 本文还原从产品提出路由参数同步的需求，到代码实现、抽离封装的过程。涉及高阶组件、ES6类继承和 AOP编程

# 需求来啦~

## 需求场景

今年广东的冬天有点冷，我如同往常一般，戴着30db降噪耳机，敲着红轴机械键盘，在代码的海洋里遨游(<del>被Bug摁在地上不断摩擦</del>)

产品小姐姐突然走到我身后，拍了拍我的肩膀，要求实现一个功能，把运营小姐姐填写的文字、下拉框选择了第几个等，分享给其他运营小伙伴(￣ω￣(￣ω￣〃 (￣ω￣〃)ゝ。

在后台管理中，界面常常会有几个筛选条件，在输入框填写、下拉框选择等，填写完时，将服务端的数据拉取展示在表格中。如下图所示:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/914599a657cc44c9861e1f1b2b41b1d8~tplv-k3u1fbpfcp-watermark.image)

## 代码实现
    
把填写的信息，保存到网址路由参数。那么分享的网址，就带了输入信息，这是比较方便的方式。

每个筛选条件输入值修改，触发路由参数更新。

当进入界面时，从路由参数获取 React state 的初始值。

实现如下图所示:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/837cc0c049494d61ba74fcea3ea95e2f~tplv-k3u1fbpfcp-watermark.image)

# 何以解耦

## 技术问题

旧的大量代码，基本都是用 React Class + TypeScript 的写法，去开发每一个界面。

每个界面，都在输入框、下拉框等选择条件变更时，把信息存储到路由参数上，这部分代码不多也不少，但它与每个页面的核心业务逻辑关系不那么密切

开发后台管理新界面时，更关注新的功能点，却常常要在每一个界面里去开发、维护路由参数同步，这部分功能

业务需求（保存筛选条件）-> 代码实现（路由参数同步）-> 页面业务需求与路由参数同步耦合 -> 路由参数同步功能抽离

## React组件封装

### 1. props.children
    
示例如下:

```js
// components/MyLayout.js
const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
  </div>
);

export default Layout;

// pages/index.js
import Layout from '../components/MyLayout';

export default function Index() {
  return (
    <Layout>
      <p>Hello Next.js</p>
    </Layout>
  );
}

// pages/about.js
import Layout from '../components/MyLayout';

export default function About() {
  return (
    <Layout>
      <p>This is the about page</p>
    </Layout>
  );
}
```

### 2. Higher Order Component 高阶组件

示例如下:

```js
// components/MyLayout.js
import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const withLayout = Page => {
  return () => (
    <div style={layoutStyle}>
      <Header />
      <Page />
    </div>
  );
};

export default withLayout;

// pages/index.js
import withLayout from '../components/MyLayout';

const Page = () => <p>Hello Next.js</p>;

export default withLayout(Page);

// pages/about.js

import withLayout from '../components/MyLayout';

const Page = () => <p>This is the about page</p>;

export default withLayout(Page);
```

### 3. Page content as props

示例如下:

```js
// components/MyLayout.js

import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.content}
  </div>
);

export default Layout;

// pages/index.js

import Layout from '../components/MyLayout.js';

const indexPageContent = <p>Hello Next.js</p>;

export default function Index() {
  return <Layout content={indexPageContent} />;
};

// pages/about.js

import Layout from '../components/MyLayout.js';

const aboutPageContent = <p>This is the about page</p>;

export default function About() {
  return <Layout content={aboutPageContent} />;
}
```

## 选哪种封装？

仔细阅读上面的代码，会发现选哪一种代码，都不适合我们的场景，因为它们只涉及父组件和子组件之间的嵌套，期望是横向抽离出路由参数的代码。

其中一种是高阶组件，在 React 的官方文档里，有介绍到 [高阶组件](https://react.docschina.org/docs/higher-order-components.html) 作用，解决横切关注点问题。

对于高阶组件，在 JS函数式编程中，高阶函数的作用，就是接收一个函数，进行增强（在传参、返回值做些手脚），返回一个函数。拓展到高阶组件，函数变成组件，接收一个组件，进行增强，返回一个组件

我们看看官网代码，如下所示，它接受 WrappedComponent 组件，返回 `class extends React.Component` 组件，增加订阅和更新 data 逻辑，而这个逻辑，是在多个组件中共用的。

```js
// 此函数接收一个组件...
function withSubscription(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... 并使用新数据渲染被包装的组件!
      // 请注意，我们可能还会传递其他属性
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

类比到当前将 React state 同步到路由参数的JS逻辑，也是同样的面向切面的逻辑🤔

兴高采烈地准备告诉队友们。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6ec8a3498c1418ebce172810d9d7805~tplv-k3u1fbpfcp-watermark.image)

酝酿好了...

转向左边，跟飞哥说了一通，她点了点头，说了一句话，可以改，不能有bug。

转向右边，给王哥，巴拉巴拉又说了一通，他回了两句话。哦。排期时间不能变。

OK. 队友们都告知好了。

Em... 想法都有了，只差一个开发了...

# 实现自动监听

（未完待续）

代码地址: https://github.com/NeoYo/sync-query 欢迎 Star，Thanks♪(･ω･)ﾉ


