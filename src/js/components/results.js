import React, { Component } from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';

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
          <span>Voici les mesures qui vous concernent spécifiquement. Pour voir l'ensemble des mesures pour chaque thème, vous pouvez désélectionner "{profile.titles[locale]}" ou réinitialiser les filtres.</span>
        </div>
      </div>
    );
  }
}

const NoResults = () =>
  <div className="mesure-none">
    Aucun résultat pour votre recherche <span role="img" aria-label="Emoji triste">😔</span>
  </div>


class ResultsList extends Component {
  shouldComponentUpdate({ hits, isFiltering }) {
    if (hits.length !== this.props.hits.length || isFiltering !== this.props.isFiltering) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { hits, locale, isFiltering } = this.props;
    if (!hits.length) {
      return <NoResults />
    } else {
      hits.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
      return hits.map(hit => <ThemeDetail hit={hit} key={hit.id} isFiltering={isFiltering} />)
    }
  }
}

ResultsList = connectHits(ResultsList);

class Results extends Component {
  shouldComponentUpdate({searchState: {menu:nextMenu, refinementList:nextList}, profiles:nextProfiles}) {
    if (typeof nextMenu === 'undefined' || typeof this.props.searchState.menu === 'undefined') {
      return false;
    }
    let { searchState: {menu, refinementList}, profiles, locale } = this.props;

    if (menu.profileIds !== nextMenu.profileIds ||
        refinementList[`titles.${locale}`].length !== nextList[`titles.${locale}`].length ||
        Object.keys(profiles).length !== Object.keys(nextProfiles).length) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { searchState: {menu = {}, refinementList = {}}, profiles = {}, locale } = this.props;
    let isFiltering = !!refinementList[`titles.${locale}`].length;
    return (
      <div className="results">
        <Profile profileId={menu.profileIds} profiles={profiles} locale={locale} />
        <ResultsList locale={locale} isFiltering={isFiltering} />
      </div>
    )
  }
}

export default connectStateResults(Results);
