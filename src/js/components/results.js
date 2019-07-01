import React, { Component } from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';
import isEqual from 'lodash/isEqual';
import T from 'i18n-react';

import { ThemeDetail } from './themes';


const Profile = ({ profileId, profiles, locale }) => {
  let profile = profiles[profileId];
  if (!profileId || !profile) {
    return null;
  } else {
    return (
      <div className="intro">
        <h1 className="intro-header">{profile.titles[locale]}</h1>

        <div className="intro-description">
          <p>{profile.descriptions[locale]}</p>
          <T.span text='results.profileBlurb' context={locale} title={profile.titles[locale]} />
        </div>
      </div>
    );
  }
}

const NoResults = locale =>
  <div className="mesure-none">
    {T.translate('results.noResults', {context: locale})}<span role="img" aria-label="Emoji triste">😔</span>
  </div>


class ResultsList extends Component {
  shouldComponentUpdate({ hits, isFiltering }) {
    let nextIds = hits.map(hit => hit.id).sort();
    let ids = this.props.hits.map(hit => hit.id).sort();
    if (!isEqual(nextIds, ids) || isFiltering !== this.props.isFiltering) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { hits, locale, isFiltering } = this.props;
    if (!hits.length) {
      return <NoResults locale={locale} />
    } else {
      hits.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
      return hits.map(hit => <ThemeDetail hit={hit} key={hit.id} isFiltering={isFiltering} />)
    }
  }
}

ResultsList = connectHits(ResultsList);

class Results extends Component {
  shouldComponentUpdate({searchState: {menu:nextMenu, refinementList:nextList = {}}, profiles:nextProfiles}) {
    if (typeof nextMenu === 'undefined' || typeof this.props.searchState.menu === 'undefined') {
      return false;
    }
    let { searchState: {menu, refinementList = {}}, profiles, locale } = this.props;

    if (menu.profileIds !== nextMenu.profileIds ||
        !isEqual(refinementList[`titles.${locale}`], nextList[`titles.${locale}`]) ||
        Object.keys(profiles).length !== Object.keys(nextProfiles).length) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { searchState: {menu = {}, refinementList = {}}, profiles = {}, locale } = this.props;
    let isFiltering = refinementList[`titles.${locale}`] ? !!refinementList[`titles.${locale}`].length : false;
    return (
      <div className="results">
        <Profile profileId={menu.profileIds} profiles={profiles} locale={locale} />
        <ResultsList locale={locale} isFiltering={isFiltering} />
      </div>
    )
  }
}

export default connectStateResults(Results);
