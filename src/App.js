import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
} from 'react-instantsearch/dom';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Theme from './js/static/theme';

const APP_ID = "CUET2HJEQ6"
const API_KEY = "6a6741dff7b23ea76f8749c6cc16b38b"
const INDEX_NAME = "Theme_dev"

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
          
          <main>
            <Sidebar />
            <Content />
          </main>
          
        </InstantSearch>
      </Page>
    );
  }
}

export default App;
