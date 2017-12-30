import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InstantSearch } from 'react-instantsearch/dom';

import qs from 'qs';
import { find, filter } from 'lodash';

import Sidebar from './sidebar';
import Results from './results';
import AuthModal from './auth-modal';

import { setProfile, toggleThemeFacet } from '../actions/search-actions';
import { getVoteCount } from '../actions/vote-actions';
import { closeAuth } from '../actions/auth-actions';

const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
const INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;


class Layout extends Component {
  constructor(props) {
    super(props);
    props.getVotes();
  }
  
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
    let { dispatch, location, match, searchState, profiles } = this.props;
    return (
      <InstantSearch
        appId={APP_ID}
        apiKey={API_KEY}
        indexName={INDEX_NAME}
        searchState={searchState}
      >
          <Sidebar dispatch={dispatch} location={location} match={match} />

          <div className="content">
            <Results profiles={profiles} />
          </div>

        <AuthModal isOpen={this.props.openModal} closeModal={this.props.closeAuth} />
  
      </InstantSearch>
    );
  }
};

export default connect(({profiles, themes, query, locale, auth}) => ({
  profiles,
  themes,
  query,
  locale,
  searchState: Object.assign({}, themes.searchState, profiles.searchState, query.searchState),
  openModal: auth.openModal
}), dispatch => ({
  getVotes: () => dispatch(getVoteCount()),
  closeAuth: () => dispatch(closeAuth()),
}))(Layout);
