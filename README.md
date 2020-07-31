# 微前端子应用脚手架

## 目录简介

1. [介绍](#介绍) 
2. [前置知识](#前置知识) 
    * [路由](#路由)
    * [生命周期](#生命周期)
3. [程序目录](#程序目录)
4. [开发与构建命令](#开发与构建命令)
    * [依赖配置](#依赖配置)
    * [命令说明](#命令说明)
5. [开发流程](#开发流程)
   * [概述](#概述)
   * [载入组件配置路由](#载入组件配置路由)
   * [配置 API 接口](#配置API接口)
   * [创建http请求](#创建http请求)
   * [调用http请求](#调用http请求)
   * [使用Reudx(可选)](#使用Redux)
     * [说明](#说明)
     * [创建Actions](#创建Actions)
     * [创建ActionTypes](创建ActionTypes)
     * [创建Reduce](#创建Reduce)
     * [发起Actions](#发起Actions)
     * [获取Store](#获取Store)
   * [发布](#发布)

## <a name="介绍">介绍</a>

基于 [create-react-app(3.0.1)](https://facebook.github.io/create-react-app/) & webpack(4)  & redux(4) & react-router(5) 的微前端子应用脚手架工程模板

[进入独立应用](http://child.portal.b-platforms.com/REACTCHILDAPP/)  

[进入 Portal 整合门户应用](http://portal.b-platforms.com/)

[进入 Portal 应用注册中心](http://register.portal.b-platforms.com/)

[进入 Portal 应用开发网站](http://guide.portal.b-platforms.com/)

## <a name="前置知识">前置知识</a>  
### <a name="路由">路由</a>
1. [路由由来](https://react-guide.github.io/react-router-cn/docs/Introduction.html)

2. [路由匹配原理](https://react-guide.github.io/react-router-cn/docs/guides/basics/RouteMatching.html)  
    4.0版本前后**路径语法**不一样，请注意！


3. [Histoy](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)  
Browser history 是使用 React Router 的应用推荐的 history。它使用浏览器中的 [History](https://developer.mozilla.org/en-US/docs/Web/API/History) API 用于处理 URL，创建一个像`example.com/some/path`这样真实的 URL ，没有 hash（`#`）部分；  
Hash history 使用 URL 中的 hash（`#`）部分去创建形如 `example.com/#/some/path` 的路由。


4. [默认路由](https://react-guide.github.io/react-router-cn/docs/guides/basics/IndexRoutes.html)  
给 **/** 路由对应组件的子元素添加一个默认组件，该组件可作为**组件模版**使用，在其中添加**通用头部**、**通用脚部**、**通用版权**、**面包屑**、**安全机制**等


5. [动态路由](https://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html)  
即组件按需加载，对于类似不同角色，加载不同组件的场景，特别有用，避免不同角色需要加载全部组件，而造成首次页面加载缓慢的问题
    ```shell
    # 添加 babel 配置
    vim package.json
    ...
    "babel": {
        "presets": [
          "react-app",
          "@babel/preset-react"
        ],
        "plugins": [
          "@babel/plugin-syntax-dynamic-import"
        ]
      },
    ...

    # 添加 @loadable/component 包
    yarn add @loadable/component

    # 添加动态路由
    vim src/router/index.js
    ...
    import loadable from '@loadable/component'
    const Home = loadable(() => import('@/pages/home/Index'))
    ...
    ```

6. [跳转前确认](https://react-guide.github.io/react-router-cn/docs/guides/advanced/ConfirmingNavigation.html)  
React Router 4 中被 Prompt 组件取代


7. [组件生命周期](https://react-guide.github.io/react-router-cn/docs/guides/advanced/ComponentLifecycle.html)  

8. [在组件外部使用导航](https://react-guide.github.io/react-router-cn/docs/guides/advanced/NavigatingOutsideOfComponents.html)  

9. [API 文档](https://react-guide.github.io/react-router-cn/docs/API.html)

10. [高阶组件](<https://zh-hans.reactjs.org/docs/higher-order-components.html>)  
一个没有副作用的纯函数，且该函数接受一个组件作为参数，并返回一个新的组件。主要功能是封装并抽离组件的通用逻辑，让此部分逻辑在组件间更好地被复用。


11. [代码分割](https://zh-hans.reactjs.org/docs/code-splitting.html)  
React 16.6 支持  [`React.lazy`](https://zh-hans.reactjs.org/docs/code-splitting.html)，作用是按需加载组件（俗称“懒加载”），但目前功能还不及 [`@loadable/component` ](https://www.smooth-code.com/open-source/loadable-components/docs/component-splitting/)完善，待完善后修改也很简单。  

## <a name="生命周期">生命周期</a>  
大家可以点击 [React 官网](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) 查看不同版本的生命周期图谱。官网已有的释义，在此不做赘述，但有链接。我只对开发中要注意的地方做说明，并且在代码相应位置做了详细注释  

![](https://git.michaelxu.cn/classroom/react/react-webpack-start-old/raw/develop/public/projects.wojtekmaj.pl_react-lifecycle-methods-diagram_.png)  

**组件在创建时会触发5个钩子函数：**

1. [constructor()](https://zh-hans.reactjs.org/docs/react-component.html#constructor)  
在里面调用 `super(props)`，可能会从`props`里面找到你需要的东西，比如`history`和`location`

2. [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)  
不常用


3. [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)
唯一必须实现的方法，创建虚拟DOM，应该保证它为纯函数，不准调用 this.setState 和写业务逻辑及引用其他页面组件，因为编译时 render 方法的内容会被直接替换掉，你的逻辑代码不会起作用


4. [componentWillMount()](https://zh-hans.reactjs.org/docs/react-component.html#unsafe_componentwillmount)  
即将过时，避免使用


5. [componentDidMount()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)  
组件渲染之后调用，可以通过this.getDOMNode()获取和操作DOM节点，且只调用一次。http请求推荐的地方，但有时候当组件销毁的时候，可能http请求还未完成，可以通过设置状态isMount，来解决此问题，代码中有示例  

**组件在更新时会触发6个钩子函数：**

6. [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)  
不常用

7. [shouldComponentUpdate(nextProps, nextState)](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)  
react性能优化非常重要的一环：父组件重新渲染会导致其所有子组件的重新渲染，所以可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候，不过首次渲染或使用 `forceUpdate()` 时不会调用该方法。**后续版本，React 可能会将 `shouldComponentUpdate` 视为提示而不是严格的指令，并且，当返回 `false` 时，仍可能导致组件重新渲染，可以考虑使用内置的 PureComponent 组件，不去使用`shouldComponentUpdate` ，示例已实现**

8. [componentWillUpdate(nextProps, nextState)](https://zh-hans.reactjs.org/docs/react-component.html#unsafe_componentwillupdate)  
shouldComponentUpdate返回true，组件进入重新渲染更新的流程，此处不准调用 this.setState。**即将过时，避免使用**


9. [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)  

10. [getSnapshotBeforeUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)  
不常用

11. [componentDidUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate)  
组件更新完毕，此时可以获取dom节点，此处不准调用 this.setState. 

**组件从 DOM 中移除时会触发1个钩子函数：**

12. [componentWillUnmount()](https://zh-hans.reactjs.org/docs/react-component.html#componentwillunmount)  
一些事件监听和定时器需要在此时清除  


**应该在何时设置state：**  

![when-to-set-the-state](https://git.michaelxu.cn/classroom/react/react-webpack-start-old/raw/develop/public/when-to-set-the-state.png)  


## <a name="程序目录">程序目录</a>

```
├── build                                   // 打包目录
├── config                                  // 构建相关  
├── scripts                                 // 配置相关
├── mock                                  	// 测试模拟数据
├── public                                  // 公共资源目录
├── src                                     // 源代码
│   ├── api                                 // 所有 HTTP 请求
│   │   ├── home.js                         // 首页（根据业务模块命名，和 /pages/* 一一对应）
│   ├── assets                              // 图片样式等静态资源
│   ├── components                          // 全局公用组件
│   ├── router                              // 路由
│   │   ├── index.js                        // 路由入口
│   ├── utils                               // 全局公用方法
│   │   ├── auth.js                         // 操作 token 
│   │   ├── cookies.js                      // 操作 cookies
│   │   ├── index.js                        // 公用方法
│   │   ├── request.js                      // 全局 http 请求方法封装
│   │   ├── storage.js                      // 全局 storage 相关方法封装
│   ├── pages                               // 页面视图
│   │   ├── home                            // 响应路由切换的组件（根据业务模块命名，和 /api/* 一一对应）
│   ├── index.js                            // 入口加载组件初始化等
└── package.json                            // 包配置
```  

## <a name="开发与构建命令">开发与构建命令</a>

### <a name="依赖配置">依赖配置</a>

```shell
# 安装依赖   
yarn

# 进入开发模式，启动前台应用，监听文件改动自动刷新浏览器  
yarn start

# 构建文件到 dist 目录供发布
yarn run build
```

如果一切顺利，就能正常打开端口: [http://localhost:3000/](http://localhost:3000/)       

### <a name="命令说明">命令说明</a>

| `yarn run <script>` | 解释             |
| ------------------- | ---------------- |
| `test`              | 启动测试服务     |
| `start`             | 启动3000端口服务 |
| `build`             | 打包正式资源     |  

## <a name="开发流程">开发流程</a>

### <a name="概述">概述</a>

1. 克隆本脚手架，或按照[搭建方法](#搭建方法)一步一步自己搭建
2. 根据项目实际需求，配置组件 `src/router/AsyncComponents.js` 和路由 `src/router/routes.js` 、HTTP 请求代理地址 `/config/webpackDevServer.config.js`，准备各路由所对应的 React 文件（例如：`src/pages/Home/index.js`，请根据业务模块命名），分配给项目成员实现
3. 访问 [可视化接口管理工具]([http://rap2.taobao.org](http://rap2.taobao.org/)) 配置 mock 数据
4. 实现 React 文件的界面部分
5. 后端实现 RESTful 接口，并维护接口文档
6. 调试后端接口
7. 测试


### <a name="载入组件配置路由">载入组件配置路由</a>
文件地址：[`/src/router/SyncComponents.js`](/src/router/SyncComponents.js) 

```js
const components = {
    '/blank-layout': require('@/layouts/BlankLayout'), // 空模版
    '/basic-layout': require('@/layouts/BasicLayout'), // 基础模版
    '/page-nav-layout': require('@/layouts/PageNavLayout'), // 导航模版
    '/user-layout': require('@/layouts/UserLayout'), // 登录模版
    '/register-layout': require('@/layouts/RegisterLayout'), // 注册模版
    '/': require('@/pages/Home/index'), // 首页
    '/account': require('@/pages/Account/index'), // 我的
}
export default components
```  

文件地址：[`/src/router/AsyncComponents.js`](/src/router/AsyncComponents.js) 

```js
import loadable from 'react-loadable' // 代码分割高阶组件，封装后的组件会“懒加载”，React 16.6 支持 React.lazy，作用和其类似，截至目前还不够完善
import Loading from '@/components/Loading'

/**
 * 导入组件
 * 通过 loadable 高阶组件包装过的组件，为懒加载组件
 * 所有加载组件必须做好注释，比如：// 首页
 */
const components = {
  '/exception/401': loadable({
    loader: () => import('@/pages/Exception/401'),
    loading: Loading,
    delay: 300,
  }), // 401
  '/exception/403': loadable({
    loader: () => import('@/pages/Exception/403'),
    loading: Loading,
    delay: 300,
  }), // 403
  '/exception/404': loadable({
    loader: () => import('@/pages/Exception/404'),
    loading: Loading,
    delay: 300,
  }), // 404
  '/exception/500': loadable({
    loader: () => import('@/pages/Exception/500'),
    loading: Loading,
    delay: 300,
  }), // 500
  '/exception/no-network': loadable({
    loader: () => import('@/pages/Exception/NoNetwork'),
    loading: Loading,
    delay: 300,
  }), // 网络异常
}
export default components
```  

文件地址：[`/src/router/routes.js`](/src/router/routes.js) 

```js
/**
 * 配置路由
 * @key { 路由名称 会在页面头部显示 type:string } name
 * @key { 路由路径 路由路径 type:string } path
 * @key { 组件名称 路由挂载的组件 type:function } component
 * @key { 路由权限 是否进行权限校验 type:boolean } authority
 * @key { 模版组件 选择模版组件，默认为基础模版 type:object } layout
 */
const routerConfig = [
  ...
  {
    name: '我的',
    path: '/account',
    component: '/account',
    authority: true,
    layout: '/page-nav-layout',
    animated: 'none',
  },
  {
    name: '设置',
    path: '/setting',
    component: '/setting',
    authority: true,
  },
  {
    name: '关于我们',
    path: '/about-us',
    component: '/about-us',
    authority: false,
  },
  ...
]
```  

### <a name="配置API接口">配置 API 接口</a>

文件地址：[`/config/webpackDevServer.config.js`](/config/webpackDevServer.config.js) 

```js
...
proxy: {
      '/v4': {
        target: `https://git.michaelxu.cn/api/v4/`, // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/v4': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
      },
      '/oauth': {
        target: `https://git.michaelxu.cn/oauth/`, // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/oauth': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
      },
    },
...
```

### <a name="创建http请求">创建http请求</a>

文件地址：[`/api/login.js`](/api/login.js) 

```js
import request from '@/utils/request'

// 根据业务模块命名，和 /pages/* 一一对应
export async function queryLoginByPass(params) {
    return request('/oauth/token', {
      method: 'POST',
      body: params,
    })
}
export async function queryLogout(params) {
  return request('/v4/user', {
    method: 'POST',
    body: params,
  })
}
```

### <a name="调用http请求">调用http请求</a>

文件地址：[`/src/pages/User/Login.js`](/src/views/User/Login.js) 

```
    this.props.dispatch(queryLoginByPass()).catch(e => {
      console.log(e)
    })
```

### <a name="使用Redux">使用Redux(可选)</a>

#### <a name="说明">说明</a>

**动机**

使用 Redux 不是必须的，但当你遇到以下几个场景，就可以开始考虑使用了

**你有着相当大量的、随时间变化的数据或状态**，比如：缓存数据、本地生成尚未持久化到服务器的数据、UI 状态、激活的路由、被选中的标签、是否显示加载动效、分页器等等
* **当前 view 的 model 变化会引起多个其他 view 变化（但使用 Redux 管理大量的 state，会是页面性能下降，注意平衡）**
* **你觉得把所有 state 放在最顶层组件中已经无法满足需要了**

**三大原则**

* **单一数据源**：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
* **State 是只读的**：唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象
* **使用纯函数来执行修改**：为了描述 action 如何改变 state tree ，你需要编写 reducers

**数据流**

> **严格的单向数据流**是 Redux 架构的设计核心

1. **调用** [`store.dispatch(action)`](http://cn.redux.js.org/docs/api/Store.html#dispatch)

2. **Redux store 调用传入的 reducer 函数**

3. **Redux store 保存了根 reducer 返回的完整 state 树**  


#### <a name="创建Actions">创建Actions</a>

文件地址：[`/src/actions/login.js`](/src/actions/login.js) 

```js
import { queryLoginByPass } from '@/api/login'
import { fetchCurrent } from './user'
import * as types from '@/constants/ActionTypes'
import store from '@/index'
import { Toast } from 'antd-mobile'

...
export const fetchLoginByPass = param => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    queryLoginByPass(param)
      .then(response => {
        dispatch({
          type: types.CHANGE_LOGIN_STATUS,
          payload: {
            response,
            currentAuthority: response.access_token, // 全局唯一接口调用凭据
          },
          receivedAt: Date.now(),
        })

        if (typeof response.error === 'undefined') {
          // 登录成功，获取用户信息
          store
            .dispatch(fetchCurrent())
            .then(res => {})
            .catch(err => {})
          resolve(response)
        } else {
          const { error_description } = response
          Toast.fail(error_description)
        }
      })
      .catch(err => {
        Toast.fail(err.message, 3, null, false)
      })
  })
}
...
```  

#### <a name="创建ActionTypes">创建ActionTypes</a>

文件地址：[`/src/constants/ActionTypes.js`](/src/constants/ActionTypes.js) 

```js
export const CHANGE_LOGIN_STATUS = 'CHANGE_LOGIN_STATUS'
```

#### <a name="创建Reduce">创建Reduce</a>

文件地址：[`/src/reducers/index.js`](/src/reducers/index.js) 

```js
import login from './login'

export default combineReducers({
  login
})
```

文件地址：[`/src/reducers/login.js`](/src/reducers/login.js) 

```js
import { combineReducers } from 'redux'
import { CHANGE_LOGIN_STATUS } from '@/constants/ActionTypes'
import { setAuthority } from '@/utils/storage'

const login = (state = { pending: true, payload: false }, action) => {
  switch (action.type) {
    case CHANGE_LOGIN_STATUS:
      setAuthority(action.payload.currentAuthority)
      return {
        ...state,
        pending: false,
        payload: action.payload,
        lastUpdated: action.receivedAt,
      }
    default:
      return state
  }
}

export default combineReducers({
  login,
})
```  


#### <a name="发起Actions">发起Actions</a>

文件地址：[`/src/pages/User/Login.js`](/src/views/User/Login.js) 

```js
...
// 提交密码登录
const payload = { username, password, grant_type: 'password' }
this.props
  .dispatch(fetchLoginByPass(payload))
  .then(res => {
    this.props.history.replace(this.fromHash)
    Toast.success('恭喜您登录成功', 3, null, false)
  })
  .catch(err => {
    Toast.fail(err.message, 3, null, false)
  })      
...   
```  

#### <a name="获取Store">获取Store</a>

文件地址：[`/src/pages/User/Login.js`](/src/pages/User/Login.js) 

```js
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

...
class Login extends PureComponent {
  static propTypes = {
    login: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }
...
const mapStateToProps = state => {
  const {
    login: { login }
  } = state

  return {
    login
  }
}
export default withRouter(connect(mapStateToProps)(Login))
```  

### <a name="发布">发布</a>

```bash
yarn run build // 打包文件为 build 文件夹，请以此为根目录
```
