import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import useRelay from 'react-router-relay'

import routes from './routes'

const rootNode = document.createElement('div')
document.body.appendChild(rootNode)

ReactDOM.render((
  <Router
    history={browserHistory}
    routes={routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />),
  rootNode
)
