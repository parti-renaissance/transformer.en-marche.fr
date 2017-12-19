import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { find, filter } from 'lodash';
import qs from 'qs';
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
    let { measures, themes } = this.props;
    return (
      <InstantSearch
        appId={APP_ID}
        apiKey={API_KEY}
        indexName={INDEX_NAME}
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={createURL}
      >

        <main className="main">
        {/*
          measures are passed in to show the most recently updated measure
        */}
          <Sidebar measures={measures} themes={themes} />
          <Content />
        </main>
  
      </InstantSearch>
    );
  }
};
  
class App extends Component {
  render() {
    return (
      <Router>
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
