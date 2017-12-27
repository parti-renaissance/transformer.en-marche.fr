import React from 'react';
import { connectStateResults, connectHits } from 'react-instantsearch/connectors';
import { Hits } from 'react-instantsearch/dom';

import Theme from './theme';


const Intro = ({ title, description, children }) =>
  <div className="intro">
    <h1 className="intro-header">{title}</h1>

    <div className="intro-description">
      <p>{description}</p>
    </div>

    {children}
  </div>

const HitsWithIntro = connectHits(({ hits, profile }) => {
  if (!hits.length) {
    return (
      <div className="mesure-none">
        Aucun resultat pour votre recherche <span role="img" aria-label="Emoji disappointed">😔</span>
      </div>
    );
  }
  let [ hit ] = hits;
  let description = hit.descriptions[profile];
  return (
    <Intro title={profile} description={description}>
      <Hits hitComponent={Theme} />
    </Intro>
  );
});

const Results = connectStateResults(({ searchState: { menu = {} }, props }) => {
  let chosenProfile = menu['measures.profiles.title'];
  return <HitsWithIntro profile={chosenProfile} />
});

export default Results;
