import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from '@/pages/home/Index'

const Router = ({ component: Component, children, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props}>
        <Switch>{children}</Switch>
      </Component>
    )}
  />
)

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Router path='/' exact component={Home} />
    </Switch>
  </BrowserRouter>
)
export default Root
