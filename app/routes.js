import React from 'react'
import { IndexRoute, Route, Redirect } from 'react-router'

import UserQuery from './queries/UserQuery'
import AppContainer from './components/App/AppContainer'
// import SessionQuery from './queries/SessionQuery'
// import SessionContainer from './components/Layouts/Session/SessionContainer'
// import SignupComponent from './components/Layouts/Signup/SignupComponent'
// import LoginComponent from './components/Layouts/Login/LoginComponent'

export default (
  <Route path='/' component={AppContainer} queries={UserQuery}>
    <Redirect from='*' to='/' />
  </Route>
)

// export default (
//   <Route path='/' component={AppContainer} queries={UserQuery}>
//     <IndexRoute component={SessionContainer} queries={SessionQuery} />
//     <Route path='/signup' component={SignupComponent} />
//     <Route path='/login' component={LoginComponent} />
//     <Redirect from='*' to='/' />
//   </Route>
// )
