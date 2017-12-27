import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SearchBox } from 'react-instantsearch/dom';

import Media from "react-media"
import Color from 'color';

import LastUpdated from './last-updated';
import { ThemesList, ThemesDropdown } from './themes';
import { Profiles, ProfilesDropdown } from './profiles';
import {
  doQuery,
  toggleProfile,
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


class Sidebar extends Component {
  state = {}

  seeMoreRefinements() {
    this.setState({ viewingMore: true });
  }

  render() {
    let { viewingMore } = this.state;
    let { location, match, profiles, toggleProfile, doQuery, resetParams } = this.props;
    return (
      <aside className={`sidebar${viewingMore ? ' sidebar-more' : ''}`}>

        <Media query="(min-width: 800px)">
        {matches =>
          matches ?
            <div className="sidebar-group">
              <h3 className="sidebar-title">
                Je m&apos;interesse à...
              </h3>
              <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, THEME)}>Réinitialiser</button>

              <ThemesList
                location={location}
                match={match}
                onViewMore={this.seeMoreRefinements.bind(this)} />

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
                <button className="sidebar-reset" onClick={() => resetParams(location, match)}>Réinitialiser les fitres</button>
              </div>

              <div className="sidebar-footer">
                <LastUpdated />
              </div>

            </div>
          :
            <div className="sidebar-group">
              <ThemesDropdown attributeName="title" location={location} match={match} />
              <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, THEME)}>Réinitialiser</button>

              <ProfilesDropdown attributeName="measures.profiles.title" location={location} match={match} />
              <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, PROFILE)}>reset profile</button>
            </div>
        }
        </Media>


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
  doQuery,
  resetParams
}, dispatch))(Sidebar);
