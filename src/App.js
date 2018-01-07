import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';

import { history } from './js/store';
import './scss/App.css';
import '../node_modules/react-vis/dist/style.css';

import Layout from './js/components/layout';
import SearchPage from './js/components/search-page';
import Dashboard from './js/components/dashboard';
import AuthModal from './js/components/auth-modal';
import { closeAuth, clearToken } from './js/actions/auth-actions';

class App extends Component {
  render() {
    let { hasToken, disconnect, openModal, closeAuth } = this.props;
    return (
      <Router history={history}>
        <Layout hasToken={hasToken} disconnect={disconnect}>
          <main className="main">
            <Switch>
              <Route path="/:locale/:profile" component={SearchPage} />
              <Route path="/:locale/results" component={SearchPage} />
              <Route exact path="/:locale" component={Dashboard} />
              <Redirect from="/" to="/fr" />
            </Switch>
          </main>
          <AuthModal isOpen={openModal} closeModal={closeAuth} />
        </Layout>
      </Router>
    );
  }
}

export default connect(state => ({
  openModal: state.auth.openModal,
  hasToken: state.auth.fetchedToken
}), dispatch => ({
  closeAuth: () => dispatch(closeAuth()),
  disconnect: () => dispatch(clearToken()),
}))(App);
