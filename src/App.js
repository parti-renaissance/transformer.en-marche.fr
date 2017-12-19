import React, { Component } from 'react';
import algoliasearch from 'algoliasearch';
import { InstantSearch } from 'react-instantsearch/dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { find, filter } from 'lodash';
import qs from 'qs';
import _slugify from 'slugify';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Results from './js/static/results';

const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
const INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;


const updateAfter = 125;

const slugify = str => _slugify(str, {lower:true}).replace(/'/, '-');

const createURL = ({ menu = {}, refinementList = {}, query = '' }) => {
  let profilePathParam = menu['measures.profiles.title'] || '';
  let path = `${slugify(profilePathParam)}`;
  
  let qs = [];
  let themes = refinementList.title ? refinementList.title.map(slugify).join(',') : '';
  if (themes) {
    qs.push(`theme=${themes.replace(/'/, '-')}`);
  }
  if (query) {
    qs.push(`q=${query}`);
  }
  
  return `${path}${qs.length ? `?${qs.join('&')}` : ''}`;
}

const searchStateToUrl = ({match: { params }}, searchState) => {
  return searchState ? `/${params.locale}/${createURL(searchState)}` : '';
}
const urlToSearchState = ({ match, location, history, profiles, themes}) => {
  const searchState = {refinementList: {}, menu: {}, query: {}};
  
  let { theme, q } = qs.parse(location.search.slice(1));
  searchState.query = q;
  
  if (themes && theme) {
    let themeList = theme ? filter(themes, t => theme.split(',').includes(t.slug)).map(t => t.title) : '';
    if (themeList.length) {
      searchState.refinementList.title = themeList;
    } else {
      history.push({
        pathanme: location.pathname,
        search: ''
      });
    }
  }
  
  let { profile } = match.params;
  let profileMatch = find(profiles, ['slug', profile]);
  if (profileMatch) {
    searchState.menu['measures.profiles.title'] = profileMatch.title;
  } else {
    delete searchState.menu;
  }
  return searchState;
}

const Content = () =>
  <div className="content">
    <Results />
  </div>
  
  
class Layout extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchState: urlToSearchState(props),
    }
  }
  
  componentWillReceiveProps(props) {
    this.setState({ searchState: urlToSearchState(props) });
  }
  
  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
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
            <Route path="/:locale/:profile" render={props => <Layout {...this.state} {...props}/>} />
            <Route path="/:locale" render={props => <Layout {...this.state} {...props}/>} />
            <Route exact path="/" render={() => <Redirect to="/fr" />} />
          </Switch>
        </Page>
      </Router>
    );
  }
}

export default App;
