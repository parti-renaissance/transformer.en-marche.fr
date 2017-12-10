import React from 'react';
import { connectStateResults } from 'react-instantsearch/connectors';

import ProfileDescription from './profile-description';

const Intro = () =>
  <div className="intro">
    <h1 className="intro-header">Alors, ça avance ?</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. aliquam erat volutpat. aliquam erat volutpat. aliquam.
    </p>

    <p>
      Cette interface sera mise à jour régulièrement. Pour ne rien manquer, <a href="https://en-marche.fr/newsletter" target="_blank" rel="nofollow noopener">recevez notre newsletter hebdomadaire</a>.
    </p>
  </div>

const Results = connectStateResults(({ searchState: { menu = {} }, props }) => {
  let intro;
  let chosenProfile = menu['measures.profiles.title'];
  if (chosenProfile) {
    intro = <ProfileDescription profile={chosenProfile} profiles={props.profiles}/>
  } else {
    intro = <Intro />
  }
  return <div>{intro}{props.children}</div>
});

export default Results;
