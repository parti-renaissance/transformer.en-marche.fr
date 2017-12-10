import React from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList, connectMenu } from 'react-instantsearch/connectors';
// import { shuffle } from 'lodash';

import Color from 'color';

import LastUpdated from './last-updated';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';

const BUTTON_COLORS = [
  Color('#ffd402'), // yellow
  Color('#97e5fd'), // teal
  Color('#bec0ff'), // purple
  Color('#f9bcbc'), // red
  Color('#b6b6b6'), // dark gray
];

const addColors = items => {
  items.map((props, i) => {
    props.style = {
      backgroundColor: BUTTON_COLORS[i].rgb().string(),
      color: BUTTON_COLORS[i].darken(0.5).rgb().string()
    };
    return props;
  });
  return items;
};

const FilterButton = ({isRefined, label, value, onClick, style}) =>
  <button className={`filter-button ${isRefined && 'is-active'}`} onClick={onClick} style={style}>
    {label}
  </button>


const RefinementList = connectRefinementList(({refine, items}) => {
  // let colors = shuffle(BUTTON_COLORS);
  let list = items.map((props, i) => {
  //   let style = {
  //     backgroundColor: BUTTON_COLORS[i].rgb().string(),
  //     color: BUTTON_COLORS[i].darken(0.5).rgb().string()
  //   };
    return (
      <li key={i} className="refinement-list__item">
        <FilterButton {...props} onClick={() => refine(props.value)} />
      </li>
    )
  });
  return <ul className="refinement-list">{list}</ul>
});

const Menu = connectMenu(({refine, items}) => {
  // let colors = shuffle(BUTTON_COLORS);
  let list = items.map((props, i) => {
  //   let style = {
  //     backgroundColor: BUTTON_COLORS[i].rgb().string(),
  //     color: BUTTON_COLORS[i].darken(0.5).rgb().string()
  //   };
    return (
      <li key={i} className="refinement-list__item">
        <FilterButton {...props} onClick={() => refine(props.value)} />
      </li>
    )
  });
  return <ul className="refinement-list">{list}</ul>
});
  

const Sidebar = ({ measures }) =>
  <aside className="sidebar">
    <h3 className="sidebar-title">Je m&apos;interesse à...</h3>
    <RefinementList attributeName="title" operator="or" transformItems={addColors} />
    
    <h3 className="sidebar-title">Je suis...</h3>
    <Menu attributeName="measures.profiles.title" transformItems={addColors} />

    <SearchBox translations={{placeholder: 'Filtrer par mot-clé'}}/>
    
    <div className="sidebar-footer">
      <LastUpdated measures={measures} />
    </div>
  </aside>

export default Sidebar;
