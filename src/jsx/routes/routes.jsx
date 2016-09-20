var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router')
var Route = require('react-router/lib/Route')
var hashHistory = require('react-router/lib/hashHistory')

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={Home}/>
  </Router>
), document.getElementById('app'))
