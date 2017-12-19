import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InstantSearch } from 'react-instantsearch/dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import qs from 'qs';
import { find, filter } from 'lodash';

import { history } from './js/store';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Results from './js/static/results';

import { setProfile, toggleThemeFacet } from './js/actions/search-actions';

const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
const INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;

const Content = () =>
  <div className="content">
    <Results />
  </div>
  
class Layout extends Component {
  
  syncForProfile() {
    let { profiles, match: { params }, dispatch, searchState } = this.props;
    if (!profiles.items.length) {
      return;
    }
    let profile = find(profiles.profiles, ['slug', params.profile])
    if (profile && !Object.keys(searchState.menu).length) {
      dispatch(setProfile(profile.objectID));
    }
  }
  
  syncForTheme() {
    let { themes, location, dispatch, searchState } = this.props;
    let { theme } = qs.parse(location.search.slice(1));
    if (!themes.items.length || !theme) {
      return;
    }
    
    let foundThemes = filter(themes.themes, t => theme.split(',').includes(t.slug));
    
    if (theme && !searchState.refinementList.title.length) {
      foundThemes.forEach(({ objectID }) => dispatch(toggleThemeFacet(objectID)));
    }
  }
  
  componentDidUpdate(prevProps) {
    this.syncForProfile();
    this.syncForTheme();
  }
  
  render() {
    let { dispatch, location, match, searchState } = this.props;
    return (
      <InstantSearch
        appId={APP_ID}
        apiKey={API_KEY}
        indexName={INDEX_NAME}
        searchState={searchState}
      >

        <main className="main">
          <Sidebar dispatch={dispatch} location={location} match={match} />
          <Content />
        </main>
  
      </InstantSearch>
    );
  }
};

Layout = connect(({profiles, themes, query}) => {
  return {
    profiles,
    themes,
    query,
    searchState: Object.assign({}, themes.searchState, profiles.searchState, query.searchState)
  };
})(Layout);
  
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Page>
          <Switch>
            <Route path="/:locale/:profile?" component={Layout} />
            <Route exact path="/" render={() => <Redirect to="/fr" />} />
          </Switch>
        </Page>
      </Router>
    );
  }
}

export default App;
