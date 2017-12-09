import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
} from 'react-instantsearch/dom';
import { connectStateResults } from 'react-instantsearch/connectors';
import './scss/App.css';

import Page from './js/components/Page';
import Sidebar from './js/static/sidebar';
import Theme from './js/static/theme';

const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
const INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;

const Intro = () =>
  <div className="intro">
    <h1 className="intro-header">Alors, ça avance ?</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. aliquam erat volutpat. aliquam erat volutpat. aliquam.
    </p>

    <p>
      Cette interface sera mise à jour régulièrement. Pour ne rien manquer, recevez notre newsletter hebdomadaire.
    </p>
  </div>

const Results = connectStateResults(({searchState, searchResults, props}) => {
  if (searchState.menu && searchState.menu['profiles.profile.title'].length) {
    return props.children;
  } else {
    return (
      <div>
        <Intro />
        {props.children}
      </div>
    );
  }
});

const Content = () =>
  <div className="content">
    <Results>
      <Hits hitComponent={Theme} />
    </Results>
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
