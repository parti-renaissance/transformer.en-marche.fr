import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';

import { history } from './js/store';
import './scss/App.css';

import Layout from './js/components/layout';
import SearchPage from './js/components/search-page';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Layout>
          <main className="main">
            <Switch>
              <Route path="/:locale/:profile?" component={SearchPage} />
              <Route exact path="/" render={() => <Redirect to="/fr" />} />
            </Switch>
          </main>
        </Layout>
      </Router>
    );
  }
}

export default App;
