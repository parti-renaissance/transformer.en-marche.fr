import React, { Component } from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList, connectMenu } from 'react-instantsearch/connectors';
import { reject, filter, find } from 'lodash';

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
  // {
  //   // dark gray
  //   bg: Color('#b6b6b6'),
  //   color: Color('#444444'),
  // },
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

const FilterButton = ({isRefined, label, value, onClick, style, buttonRef, children}) =>
  <button
   className={`filter-button ${isRefined && 'is-active'}`}
   onClick={onClick}
   style={style}
   ref={buttonRef}>
    <span>{children || label}</span>
  </button>


class ThemeListItem extends Component {
  state = {}
  
  measureButton() {
    let textWidth = this.button.children[0].getBoundingClientRect().width;
    this.setState({style: {flexBasis: textWidth + 24}});
  }
  
  componentDidMount() {
    this.measureButton();
  }
  
  componentWillReceiveProps() {
    this.measureButton();
  }
  
  render() {
    let { props, state } = this;
    return (
      <li className={`refinement-list__item ${props.className}`} style={state.style}>
        {props.children ||
          <FilterButton {...props} onClick={() => props.refine(props.value)} buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


const Themes = ({ onViewMore, themes }) => {
  return (
    <ul className="refinement-list">
      <ThemeFilters
        transformItems={addColors}
        themes={themes}
        attributeName="title"
        limitMin={1000}>
        
        <li className="refinement-list__item refinement-list__item-more">
          <FilterButton onClick={onViewMore} style={{backgroundColor: 'rgba(182, 182, 182, 0.2)', color: '#444444'}}>
            Voir tous les thèmes
          </FilterButton>
        </li>
        
      </ThemeFilters>
        
    </ul>
  );
};


const ThemeFilters = connectRefinementList(({children, refine, themes=[], items = [], exclude = []}) => {
  if (!items.length || !themes.length) {
    return null;
  }
  let activeThemes = filter(items, 'isRefined');

  let inActiveThemes = reject(items, 'isRefined').map(item => find(themes, ['title', item.label]));
  let featuredThemes = filter(inActiveThemes, 'isFeatured').map(theme => find(items, ['label', theme.title]));
  let otherThemes = reject(inActiveThemes, 'isFeatured').map(theme => find(items, ['label', theme.title]));
  return activeThemes
    .map(props => <ThemeListItem key={props.label} refine={refine} {...props} />)
    .concat(featuredThemes
      .map(props => <ThemeListItem key={props.label} refine={refine} {...props} />))
      .concat(children)
      .concat(otherThemes
        .map(props => <ThemeListItem key={props.label} className="refinement-list__item-other" refine={refine} {...props} />));
});


const Profiles = connectMenu(({refine, items}) => {
  let list = items.map(props => {
    return (
      <li key={props.label} className="refinement-list__item">
        <FilterButton {...props} onClick={() => refine(props.value)} />
      </li>
    )
  });
  return <ul className="refinement-list">{list}</ul>
});
  

class Sidebar extends Component {
  state = {}
  
  seeMoreRefinements() {
    this.setState({ viewingMore: true });
  }
  
  render() {
    let { measures, themes } = this.props;
    let { viewingMore } = this.state;
    return (
      <aside className={`sidebar ${viewingMore && 'sidebar-more'}`}>
      
        <h3 className="sidebar-title">Je m&apos;interesse à...</h3>
        <Themes onViewMore={this.seeMoreRefinements.bind(this)} themes={themes}/>
        
        <h3 className="sidebar-title">Je suis...</h3>
        <Profiles attributeName="measures.profiles.title" transformItems={addColors} />

        <SearchBox translations={{placeholder: 'Filtrer par mot-clé'}}/>
        
        <div className="sidebar-footer">
          <LastUpdated measures={measures} />
        </div>
      </aside>
    );
  }
}

export default Sidebar;
