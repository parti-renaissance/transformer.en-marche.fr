import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InstantSearch } from 'react-instantsearch/dom';
import ReactTooltip from 'react-tooltip';

import qs from 'qs';
import { find, filter } from 'lodash';
import isEqual from 'lodash/isEqual';

import Sidebar from './sidebar';
import Results from './results';
import Banner from './banner';

import { setProfile, toggleThemeFacet, toggleManifestoFacet } from '../actions/search-actions';
import { getVoteCount } from '../actions/vote-actions';
import { setLocale } from '../actions/translate-actions';

const APP_ID      = process.env.REACT_APP_ALGOLIA_APP_ID;
const API_KEY     = process.env.REACT_APP_ALGOLIA_API_KEY;
const THEME_INDEX = process.env.REACT_APP_ALGOLIA_THEME_INDEX;


class Layout extends Component {
  state = {
    showBanner: true,
  }

  closeBanner = () => {
    this.setState({showBanner: false})
  }

  constructor(props) {
    super(props);
    props.dispatch(getVoteCount());
  }

  syncForProfile(nextProps) {
    let {
      profiles,
      match: { params: {locale, profile} },
      dispatch,
    } = nextProps;
    let found = find(profiles.profiles, p => p.slugs[locale] === profile);

    if (found) {
      dispatch(setProfile(found.id));
    }
  }

  syncForTheme(nextProps) {
    let {
      themes,
      location,
      dispatch,
      match: { params: {locale} },
    } = nextProps;
    let { theme = '' } = qs.parse(location.search.slice(1));
    let foundThemes = filter(themes.themes, t => theme.split(',').includes(t.slugs[locale]));

    if (theme) {
      foundThemes.forEach(({ id }) => dispatch(toggleThemeFacet(id)));
    }
  }

  syncForManifesto(nextProps) {
    let {
      manifestos,
      location,
      dispatch,
      match: { params: { locale }},
    } = nextProps;
    let { manifesto = '' } = qs.parse(location.search.slice(1));
    let foundManifestos = filter(manifestos.manifestos, m => manifesto.split(',').includes(m.slugs[locale]))

    if (manifesto) {
      foundManifestos.forEach(({ id }) => dispatch(toggleManifestoFacet(id)));
    }
  }

  syncForLocale() {
    let { dispatch, locale, location, match: { params } } = this.props;
    // if locale from state does not match locale from url
    // use locale from state
    if (locale !== params.locale) {
      dispatch(setLocale(locale, location, true));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.themes.fetched !== nextProps.themes.fetched)  {
      this.syncForTheme(nextProps);
    }
    if (this.props.profiles.fetched !== nextProps.profiles.fetched) {
      this.syncForProfile(nextProps);
    }
    if (this.props.manifestos.fetched !== nextProps.manifestos.fetched) {
      this.syncForManifesto(nextProps);
    }

    this.syncForLocale();
  }

  shouldComponentUpdate(props, state) {
    if (props.profiles.fetching !== this.props.profiles.fetching)  {
      return true;
    } else if (props.themes.fetching !== this.props.themes.fetching) {
      return true;
    } else if (props.manifestos.fetching !== this.props.manifestos.fetching) {
      return true;
    } else if (!isEqual(props.searchState, this.props.searchState)) {
      return true;
    } else if (state.showBanner !== this.state.showBanner) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let {
      dispatch,
      location,
      match,
      searchState,
      profiles,
      themes,
      manifestos,
      locale,
    } = this.props;
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
          locale={locale}
          dispatch={dispatch}
          profiles={profiles.items.map(id => profiles.profiles[id])}
          themes={themes.items.map(id => themes.themes[id])}
          manifestos={manifestos.items.map(id => manifestos.manifestos[id])}
          className={this.state.showBanner ? 'is-open-banner' : ''}
        />

        <div className={`content ${this.state.showBanner ? 'is-open-banner' : ''}`}>
          <ReactTooltip
            place="top"
            type="light"
            effect="solid"
            className="measure-manifesto__tooltip"
          />

          {this.state.showBanner &&
            <div className="content__top">
              <Banner close={this.closeBanner}>
                <a href="https://chezvous.en-marche.fr" target="_blank" rel="noopener noreferrer">
                  Bilan des 2 ans du quinquennat - Consultez ce qui a changé près de chez vous →
                </a>
              </Banner>
            </div>
          }

          <Results profiles={profiles.profiles} locale={locale} />
        </div>

      </InstantSearch>
    );
  }
};

export default connect(({profiles, themes, manifestos, query, locale}) => ({
  manifestos,
  profiles,
  themes,
  query,
  locale,
  searchState: {
    menu: {profileIds: profiles.searchState, manifestoIds: manifestos.searchState},
    query: query,
    refinementList: {
      [`titles.${locale}`]: themes.searchState.map(id => themes.themes[id].titles[locale])
    }
  }
}))(Layout);
