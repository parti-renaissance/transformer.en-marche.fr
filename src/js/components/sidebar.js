import React, { Component } from 'react';
import { SearchBox } from 'react-instantsearch/dom';

import Media from "react-media"
import Color from 'color';

import ToggleSwitch from './toggle-switch';
import LastUpdated from './last-updated';
import { ThemesList, ThemesDropdown } from './themes';
import { Profiles, ProfilesDropdown } from './profiles';
import {
  toggleMajor,
  doQuery,
  toggleProfile,
  toggleTheme,
  resetParams,
  QUERY,
  THEME,
  PROFILE
} from '../actions/search-actions';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';
import 'react-select/dist/react-select.css';

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

export const getColor = i => {
  let index = i % BUTTON_COLORS.length;
  let { bg, color } = BUTTON_COLORS[index];
  return {
    backgroundColor: bg.rgb().alpha(0.2).string(),
    color: color.rgb().string(),
  };
};

export const FilterButton = ({isActive, label, onClick, style, buttonRef, children}) =>
  <button
   className={`filter-button ${isActive && 'is-active'}`}
   onClick={onClick}
   style={style}
   ref={buttonRef}>
    <span>{children || label}</span>
  </button>

const MobileSidebar = ({ location, match, resetParams }) =>
  <div className="sidebar-group">
    <ThemesDropdown attributeName="title" location={location} match={match} />
    <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, THEME)}>Réinitialiser</button>

    <ProfilesDropdown attributeName="measures.profiles.title" location={location} match={match} />
    <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, PROFILE)}>reset profile</button>
  </div>


const DesktopSidebar = ({ resetParams, location, match, toggleProfile, toggleTheme, showMore, profiles, themes, doQuery, majorOnly, toggleMajor }) =>
  <div className="sidebar-group">
    <h3 className="sidebar-title">
      <ToggleSwitch onChange={e => toggleMajor(e.target.checked)}>
        Voir uniquement les mesures majeures :
      </ToggleSwitch>
    </h3>
    <h3 className="sidebar-title">
      Je m&apos;interesse à...
    </h3>
    <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, THEME)}>Réinitialiser</button>

    <ThemesList
      themes={themes}
      location={location}
      match={match}
      toggleTheme={toggleTheme}
      onViewMore={showMore} />

    <h3 className="sidebar-title">
      Je suis...
    </h3>
    <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, PROFILE)}>Réinitialiser</button>

    <Profiles
      location={location}
      locale={match.params.locale}
      toggleProfile={toggleProfile}
      profiles={profiles}
      limitMin={1000}
      attributeName="measures.profiles.title" />

    <div className="sidebar-search">
      <SearchBox
        onInput={e => doQuery(e.target.value)}
        searchAsYouType={false}
        translations={{placeholder: 'Filtrer par mot-clé'}}/>
      <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, QUERY)}>Réinitialiser</button>
      <button className="sidebar-reset" onClick={() => resetParams(location, match)}>Réinitialiser les filtres</button>
    </div>

    <div className="sidebar-footer">
      <LastUpdated />
    </div>

  </div>

export default class Sidebar extends Component {
  state = {}

  seeMoreRefinements() {
    this.setState({ viewingMore: true });
  }

  render() {
    let { viewingMore } = this.state;
    let { location, match, profiles, themes, majorOnly, dispatch } = this.props;
    return (
      <aside className={`sidebar${viewingMore ? ' sidebar-more' : ''}`}>

        <Media query="(min-width: 800px)">
        {matches =>
          matches ?
            <DesktopSidebar
             location={location}
             match={match}
             profiles={profiles}
             themes={themes}
             majorOnly={majorOnly}
             showMore={this.seeMoreRefinements.bind(this)}
             toggleTheme={(...args) => dispatch(toggleTheme(...args))}
             toggleProfile={(...args) => dispatch(toggleProfile(...args))}
             doQuery={(...args) => dispatch(doQuery(...args))}
             resetParams={(...args) => dispatch(resetParams(...args))}
             toggleMajor={checked => dispatch(toggleMajor(checked))}
            />
          :
            <MobileSidebar location={location} match={match} />
        }
        </Media>

      </aside>
    );
  }
}
