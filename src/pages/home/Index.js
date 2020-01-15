import React, { PureComponent } from 'react'
import logo from '@/assets/logo.svg'
import './Index.css'
import { fakeUser, queryUser } from '@/api/home'

class Home extends PureComponent {
  constructor (props) {
    // 构造方法
    super(props) // 调用父类构造函数，返回子类实例
    this.state = {
      date: new Date(),
      avatar: '',
      introduction: '',
      name: '',
      roles: ''
    }
    this.onClickSubmit = this.onClickSubmit.bind(this)
    // console.log(
    //   'Parent component props history:' +
    //     JSON.stringify(this.props.history) +
    //     ',Parent component props location:' +
    //     JSON.stringify(this.props.location)
    // )
  }
  componentWillMount () {
    // 即将过时，避免使用
    // 组件刚经历constructor，初始完数据，DOM还未渲染
  }
  componentDidMount () {
    // 组件第一次渲染完成，此时DOM节点已经生成，可以在这里调用http请求，返回数据setState后组件会重新渲染
    this.timerID = setInterval(() => this.tick(), 1000)
    this.isMount = true
    fakeUser().then(result => {
      // 有时候当组件销毁的时候，可能http请求还未完成，可以通过设置状态isMount，来解决此问题
      this.isMount &&
        this.setState({}, () => {
          // 在这个函数内你可以拿到 setState 之后的值（因为state 和 props 是异步更新的，你不能在 setState 马上拿到 state 的值）
          console.log('创建用户成功')
        })
    })
  }
  componentWillReceiveProps (nextProps) {
    // 即将过时，避免使用
    // console.log('当前props：' + JSON.stringify(this.props) + '改变后props：' + JSON.stringify(nextProps))
    // nextProps.openNotice !== this.props.openNotice &&
    //   this.setState(
    //     {
    //       openNotice: nextProps.openNotice
    //     },
    //     () => {
    // 在这个函数内你可以拿到 setState 之后的值，因为this.state 和 props 一定是异步更新的，所以你不能在 setState 马上拿到 state 的值
    //       console.log(this.state.openNotice, nextProps) // 将state更新为nextProps,在setState的第二个参数（回调）可以打印出新的state
    //     }
    //   )
  }
  // shouldComponentUpdate (nextProps, nextState) {
  //   // 组件接受新的state或者props时调用，继承PureComponent，禁止使用
  //   // react性能优化非常重要的一环：父组件重新渲染会导致其所有子组件的重新渲染，所以可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候。后续版本，React 可能会将 shouldComponentUpdate 视为提示而不是严格的指令，并且，当返回 false 时，仍可能导致组件重新渲染，可以考虑使用内置的 PureComponent 组件
  // }
  componentWillUpdate (nextProps, nextState) {
    // shouldComponentUpdate返回true，组件进入重新渲染更新的流程，此处不准调用 this.setState
  }
  componentDidUpdate () {
    // 组件更新完毕，此时可以获取dom节点，此处不准调用 this.setState
  }
  componentWillUnmount () {
    // 组件将要卸载，一些事件监听和定时器需要在此时清除
    this.isMount = false
    clearInterval(this.timerID)
  }
  tick () {
    this.setState({
      date: new Date()
    })
  }
  onClickSubmit = e => {
    e.preventDefault()
    // 任何组件的事件传递都要以 on 开头
    queryUser().then(result => {
      const { avatar, introduction, name, roles } = result
      this.setState({
        avatar: avatar,
        introduction: introduction,
        name: name,
        roles: roles
      })
    })
  }
  render () {
    // 此处不准调用 this.setState 和写逻辑及引用其他页面组件，因为编译时 render 方法的内容会被直接替换掉，你的逻辑代码不会起作用
    const { date, avatar, introduction, name, roles } = this.state
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>现在的时间是 {date.toLocaleTimeString()}.</p>
          <a
            className='App-link'
            href='javascript:;'
            onClick={this.onClickSubmit}
          >
            获取用户信息
          </a>
          <img src={avatar} className='App-logo' alt='' />
          <p>{name}</p>
          <p>{roles}</p>
          <p>{introduction}</p>
        </header>
      </div>
    )
  }
}

export default Home
