import React from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList, connectMenu } from 'react-instantsearch/connectors';
// import { shuffle } from 'lodash';

import Color from 'color';

import LastUpdated from './last-updated';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';

const BUTTON_COLORS = [
  {
    // yellow
    bg: Color('#ffd402'),
    color: Color('#ff6955'),
  },
  {
    // teal
    bg: Color('#97e5fd'),
    color: Color('#00bef9'),
  },
  {
    // purple
    bg: Color('#bec0ff'),
    color: Color('#6f81ff'),
  },
  {
    // red
    bg: Color('#f9bcbc'),
    color: Color('#ff3856'),
  },
  {
    // dark gray
    bg: Color('#b6b6b6'),
    color: Color('#444444'),
  },
];

const addColors = (items = []) => {
  items.map((props, i) => {
    let index = i % BUTTON_COLORS.length;
    let { bg, color } = BUTTON_COLORS[index];
    props.style = {
      backgroundColor: bg.rgb().alpha(0.2).string(),
      color: color.rgb().string(),
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
