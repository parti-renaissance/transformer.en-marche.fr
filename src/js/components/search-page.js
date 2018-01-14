import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InstantSearch } from 'react-instantsearch/dom';

import qs from 'qs';
import { find, filter } from 'lodash';
import isEqual from 'lodash/isEqual';

import Sidebar from './sidebar';
import Results from './results';

import { setProfile, toggleThemeFacet } from '../actions/search-actions';
import { getVoteCount } from '../actions/vote-actions';

const APP_ID      = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY     = process.env.REACT_APP_ALGOLIA_API_KEY;
const THEME_INDEX = process.env.REACT_APP_ALGOLIA_THEME_INDEX;


class Layout extends Component {
  constructor(props) {
    super(props);
    props.dispatch(getVoteCount());
  }
  
  syncForProfile() {
    let { profiles, match: { params }, dispatch, searchState } = this.props;
    if (!profiles.items.length) {
      return;
    }
    let profile = find(profiles.profiles, ['slug', params.profile])
    if (profile && !searchState.menu.profileIds) {
      dispatch(setProfile(profile.id));
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
      foundThemes.forEach(({ id }) => dispatch(toggleThemeFacet(id)));
    }
  }
  
  componentDidUpdate(prevProps) {
    this.syncForProfile();
    this.syncForTheme();
  }
  
  shouldComponentUpdate(props, state) {
    if (props.profiles.fetching !== this.props.profiles.fetching)  {
      return true;
    } else if (props.themes.fetching !== this.props.profiles.fetching) {
      return true;
    } else if (!isEqual(props.searchState, this.props.searchState)) {
      return true;
    } else {
      return false;
    }
  }
  
  render() {
    let { dispatch, location, match, searchState, profiles, themes } = this.props;
    return (
      <InstantSearch
        appId={APP_ID}
        apiKey={API_KEY}
        indexName={THEME_INDEX}
        searchState={searchState}
      >
        <Sidebar
          match={match}
          location={location}
          dispatch={dispatch}
          profiles={profiles.items.map(id => profiles.profiles[id])}
          themes={themes.items.map(id => themes.themes[id])}
        />

        <div className="content">
          <Results profiles={profiles} />
        </div>

      </InstantSearch>
    );
  }
};

export default connect(({profiles, themes, query, locale}) => ({
  profiles,
  themes,
  query,
  locale,
  searchState: Object.assign({}, themes.searchState, profiles.searchState, query.searchState),
}))(Layout);
