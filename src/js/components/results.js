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
  shouldComponentUpdate({ hits }) {
    if (hits.length !== this.props.hits.length) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { hits, locale } = this.props;
    if (!hits.length) {
      return <NoResults />
    } else {
      hits.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
      return hits.map(hit => <ThemeDetail hit={hit} key={hit.id} />)
    }
  }
}

ResultsList = connectHits(ResultsList);

class Results extends Component {
  shouldComponentUpdate({searchState: {menu:nextMenu}, profiles:nextProfiles}) {
    let { searchState: {menu}, profiles } = this.props;

    if (menu.profileIds !== nextMenu.profileIds ||
        Object.keys(profiles).length !== Object.keys(nextProfiles).length) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { searchState: { menu = {} }, profiles = {}, locale } = this.props;
    return (
      <div className="results">
        <Profile profileId={menu.profileIds} profiles={profiles} locale={locale} />
        <ResultsList locale={locale} />
      </div>
    )
  }
}

export default connectStateResults(Results);
