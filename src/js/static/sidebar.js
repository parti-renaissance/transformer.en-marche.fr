import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList, connectMenu } from 'react-instantsearch/connectors';
import { reject, filter, map } from 'lodash';

import Color from 'color';

import LastUpdated from './last-updated';
import { doQuery, toggleTheme, toggleProfile } from '../actions/search-actions';

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

const getColor = i => {
  let index = i % BUTTON_COLORS.length;
  let { bg, color } = BUTTON_COLORS[index];
  return {
    backgroundColor: bg.rgb().alpha(0.2).string(),
    color: color.rgb().string(),
  };
};

const FilterButton = ({isActive, label, onClick, style, buttonRef, children}) =>
  <button
   className={`filter-button ${isActive && 'is-active'}`}
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
      <li className={`refinement-list__item ${props.className || ''}`} style={state.style}>
        {props.children ||
          <FilterButton
           style={props.style}
           label={props.theme.title}
           isActive={props.theme.isActive}
           onClick={props.refine}
           buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


const Themes = connect(({ themes }) => {
  return {
    themes: themes.items.map(id => themes.themes[id])
  }
}, dispatch => bindActionCreators({
  toggleTheme
}, dispatch))(({ onViewMore, themes, toggleTheme, location, match }) => {
  return (
    <ul className="refinement-list">
      <ThemeFilters
        attributeName="title"
        limitMin={1000}
        themes={themes}
        toggle={theme => toggleTheme(theme, location, match)}>
        
        <li className="refinement-list__item refinement-list__item-more">
          <FilterButton onClick={onViewMore} style={{backgroundColor: 'rgba(182, 182, 182, 0.2)', color: '#444444'}}>
            Voir tous les thèmes
          </FilterButton>
        </li>
        
      </ThemeFilters>
        
    </ul>
  );
});

const ThemeFilters = connectRefinementList(({children, themes = [], items = [], toggle}) => {

  const createListItems = (theme, i) =>
    <ThemeListItem
      theme={theme}
      style={getColor(i)}
      key={theme.objectID}
      refine={() => toggle(theme)} />

  let filteredLabels = map(items, 'label')
  let filtered = filter(themes, t => filteredLabels.includes(t.title));
  let activeThemes = filter(filtered, 'isActive').map(createListItems);
  
  let inActiveThemes = reject(filtered, 'isActive')
  let featuredThemes = filter(inActiveThemes, 'isFeatured').map(createListItems);
  let otherThemes = reject(inActiveThemes, 'isFeatured').map(createListItems);
  
  return activeThemes
    .concat(featuredThemes)
    .concat(children)
    .concat(otherThemes);
});


const Profiles = connectMenu(({items, profiles, toggleProfile, location}) => {
  let filteredLabels = map(items, 'label')
  let filtered = filter(profiles, p => filteredLabels.includes(p.title));
  let list = filtered.map((profile, i) => {
    return (
      <li key={profile.objectID} className="refinement-list__item">
        <FilterButton
          style={getColor(i)}
          label={profile.title}
          isActive={profile.isActive}
          onClick={() => toggleProfile(profile, location)} />
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
    let { viewingMore } = this.state;
    let { location, match, profiles, toggleProfile, doQuery } = this.props;
    return (
      <aside className={`sidebar${viewingMore ? ' sidebar-more' : ''}`}>
      
        <h3 className="sidebar-title">Je m&apos;interesse à...</h3>
        <Themes
          location={location}
          match={match}
          onViewMore={this.seeMoreRefinements.bind(this)} />
        
        <h3 className="sidebar-title">Je suis...</h3>
        <Profiles
          location={location}
          toggleProfile={toggleProfile}
          profiles={profiles}
          limitMin={1000}
          attributeName="measures.profiles.title" />

        <SearchBox
          onInput={e => doQuery(e.target.value)}
          searchAsYouType={false}
          translations={{placeholder: 'Filtrer par mot-clé'}}/>
        
        <div className="sidebar-footer">
          <LastUpdated />
        </div>
      </aside>
    );
  }
}

export default connect(({ profiles }) => {
  return {
    profiles: profiles.items.map(id => profiles.profiles[id])
  }
}, dispatch => bindActionCreators({
  toggleProfile,
  doQuery
}, dispatch))(Sidebar);
