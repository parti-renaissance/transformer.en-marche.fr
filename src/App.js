import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';

import { history } from './js/store';
import './scss/App.css';

import Layout from './js/components/layout';
import SearchPage from './js/components/search-page';
import Dashboard from './js/components/dashboard';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Layout>
          <main className="main">
            {this.props.previousRoute && <Redirect to={this.props.previousRoute} />}
            <Switch>
              <Route path="/:locale/:profile" component={SearchPage} />
              <Route path="/:locale/results" component={SearchPage} />
              <Route exact path="/:locale" component={Dashboard} />
              <Redirect from="/" to="/fr" />
            </Switch>
          </main>
        </Layout>
      </Router>
    );
  }
}

export default App;
