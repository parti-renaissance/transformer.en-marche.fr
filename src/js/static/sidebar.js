import React from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList } from 'react-instantsearch/connectors';
import { shuffle } from 'lodash';

import Color from 'color';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';

const BUTTON_COLORS = [
  Color('#ffd402'), // yellow
  Color('#97e5fd'), // teal
  Color('#bec0ff'), // purple
  Color('#f9bcbc'), // red
  Color('#b6b6b6'), // dark gray
];

const FilterButton = ({isRefined, label, value, onClick, style}) =>
  <button className={`filter-button ${isRefined && 'is-active'}`} onClick={onClick} style={style}>
    {label}
  </button>


const RefinementList = connectRefinementList(function({refine, currentRefinement, items}) {
  let colors = shuffle(BUTTON_COLORS);
  let list = items.map((props, i) => {
    let style = {
      backgroundColor: colors[i].rgb().string(),
      color: colors[i].darken(0.5).rgb().string()
    };
    return (
      <li key={i} className="refinement-list__item">
        <FilterButton {...props} onClick={() => refine(props.value)} style={style} />
      </li>
    )
  });
  return <ul className="refinement-list">{list}</ul>
});
  

export default () =>
  <aside className="sidebar">
    <h3 className="sidebar-title">Je m&apos;interesse à...</h3>
    <RefinementList attributeName="title" />
    
    <h3 className="sidebar-title">Je suis...</h3>
    <RefinementList attributeName="profiles.profile.title" operator="and" />

    <SearchBox translations={{placeholder: 'Filtrer par mot-clé'}}/>
    
    <div className="sidebar-footer">
      <small>Dernière mise à jour il y a 2 jours.</small>
    </div>
  </aside>
