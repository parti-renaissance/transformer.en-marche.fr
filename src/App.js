import React, { Component } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch/dom';

import { connectRefinementList } from 'react-instantsearch/connectors';
import Page from './js/components/Page';

const APP_ID = "CUET2HJEQ6"
const API_KEY = "6a6741dff7b23ea76f8749c6cc16b38b"
const INDEX_NAME = "Profile_dev"

const RefinementList = connectRefinementList(function({refine, currentRefinement, items}) {
  let list = items.map((item, i) => {
    return <li key={i}>{item.isRefined ? 'active' : ''}<button onClick={() => refine(item.value)}>{item.label}</button></li>
  });
  return <ul>{list}</ul>
});

const Hit = ({hit}) =>
  <div className="hit">
    <div className="hit-image"><img src={hit.image} /></div>
    <div className="hit-content">
      <div className="hit-price">
        ${hit.salePrice}
      </div>
      <div className="hit-name">
        <Highlight attributeName="name" hit={hit} />
      </div>
      <div className="hit-descriptoin">
        <Highlight attributeName="shortDescription" hit={hit} />
      </div>
    </div>
  </div>

const Sidebar = () =>
  <div className="sidebar">
    <h5>Category</h5>
    <RefinementList attributeName="category" />
    <h5>Manufacturer</h5>
    <RefinementList attributeName="manufacturer" operator="and" />
  </div>
  
const Content = () =>
  <div className="content">
    <Hits hitComponent={Hit} />
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
