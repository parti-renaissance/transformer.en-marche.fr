import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { find, filter } from 'lodash';
import qs from 'qs';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Results from './js/static/results';

const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
const INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;

const Content = () =>
  <div className="content">
    <Results />
  </div>
  
class Layout extends Component {
    }
  }
  
  }
  
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
