import React from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';
import { Hits } from 'react-instantsearch/dom';

import { ThemeDetail } from './themes';


const Profile = ({ profile }) => {
  if (!profile) {
    return null;
  } else {
    return (
      <div className="intro">
        <h1 className="intro-header">{profile.title}</h1>

        <div className="intro-description">
          <p>{profile.description}</p>
        </div>
      </div>
    );
  }
}
  
const NoResults = () =>
  <div className="mesure-none">
    Aucun resultat pour votre recherche <span role="img" aria-label="Emoji disappointed">😔</span>
  </div>

const ResultsList = connectHits(({ hits }) => {
  if (!hits.length) {
    return <NoResults />
  } else {
    return <Hits hitComponent={ThemeDetail} />
  }
});

const Results = connectStateResults(({ searchState: { menu = {} } }) =>
  <div className="results">
    <Profile profile={menu['measures.profiles.title']} />
    <ResultsList />
  </div>
);

export default Results;
