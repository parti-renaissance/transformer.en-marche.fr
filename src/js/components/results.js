import React, { Component } from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';
import sortBy from 'lodash/sortBy';

import { ThemeDetail } from './themes';


const Profile = ({ profileId, profiles }) => {
  let profile = profiles[profileId];
  if (!profileId || !profile) {
    return null;
  } else {
    return (
      <div className="intro">
        <h1 className="intro-header">{profile.title}</h1>

        <div className="intro-description">
          <p>{profile.description}</p>
          <span>Voici les mesures qui vous concernent spécifiquement. Pour voir l'ensemble des mesures pour chaque thème, vous pouvez désélectionner "{profile.title}" ou réinitialiser les filtres.</span>
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
    let { hits } = this.props;
    if (!hits.length) {
      return <NoResults />
    } else {
      return sortBy(hits, 'slug').map(hit => <ThemeDetail hit={hit} key={hit.id} />)
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
    let { searchState: { menu = {} }, profiles = {} } = this.props;
    console.log('render');
    return (
      <div className="results">
        <Profile profileId={menu.profileIds} profiles={profiles} />
        <ResultsList />
      </div>
    )
  }
}

export default connectStateResults(Results);
