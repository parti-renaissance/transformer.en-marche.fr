import React from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';
import sortBy from 'lodash/sortBy';

import { ThemeDetail } from './themes';


const Profile = ({ profileId, profiles }) => {
  let profile = profiles.profiles[profileId];
  if (!profileId || !profile) {
    return null;
  } else {
    return (
      <div className="intro">
        <h1 className="intro-header">{profile.title}</h1>

        <div className="intro-description">
          <p>{profile.description}</p>
          <span>Voici les mesures qui vous concernent spécifiquement. Pour voir l'ensemble des mesures pour chaque thème, vous pouvez désélectionner "{profile.title}".</span>
        </div>
      </div>
    );
  }
}

const NoResults = () =>
  <div className="mesure-none">
    Aucun résultat pour votre recherche <span role="img" aria-label="Emoji triste">😔</span>
  </div>

const ResultsList = connectHits(function ResultsList({ hits }) {
  if (!hits.length) {
    return <NoResults />
  } else {
    return sortBy(hits, 'slug').map(hit => <ThemeDetail hit={hit} key={hit.id} />)
  }
});

const Results = ({ searchState: { menu = {} }, profiles = {} }) =>
  <div className="results">
    <Profile profileId={menu.profileIds} profiles={profiles} />
    <ResultsList />
  </div>

export default connectStateResults(Results);
