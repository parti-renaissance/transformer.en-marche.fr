import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
} from 'react-instantsearch/dom';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Theme from './js/static/theme';

const APP_ID = process.env.ALGOLIA_APP_ID
const API_KEY = process.env.ALGOLIA_API_KEY
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME

const Content = () =>
  <div className="content">
    <Hits hitComponent={Theme} />
  </div>

class App extends Component {
  render() {
    return (
      <Page>
        <InstantSearch
          appId={APP_ID}
          apiKey={API_KEY}
          indexName={INDEX_NAME}>
          
          <main className="main">
            <Sidebar />
            <Content />
          </main>
          
        </InstantSearch>
      </Page>
    );
  }
}

export default App;
