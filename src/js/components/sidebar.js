import React, { Component } from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import T from 'i18n-react';

import Media from "react-media"

import ToggleSwitch from './toggle-switch';
import LastUpdated from './last-updated';
import { ThemesList, ThemesDropdown } from './themes';
import { Profiles, ProfilesDropdown } from './profiles';
import { ManifestoList, ManifestoDropdown } from './manifesto';
import {
  toggleMajor,
  doQuery,
  toggleProfile,
  toggleTheme,
  toggleManifesto,
  resetParams,
  QUERY,
  THEME,
  PROFILE
} from '../actions/search-actions';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';
import 'react-select/dist/react-select.css';

export const FilterButton = ({isActive, label, onClick, style, buttonRef, children}) =>
  <button
   className={`filter-button ${isActive ? 'is-active' : ''}`}
   onClick={onClick}
   style={style}
   ref={buttonRef}>
    <span>{children || label}</span>
  </button>

const MobileSidebar = ({ location, match, resetParams, toggleMajor, locale }) =>
  <div className="sidebar-group">
    <h3 className="sidebar-title">
      <ToggleSwitch initialChecked={false} onChange={e => toggleMajor(e.target.checked)}>
        {T.translate('dashboard.majorText', {context: locale})}
      </ToggleSwitch>
    </h3>

    <ManifestoDropdown attributeName="manifestoIds" locattion={location} match={match} />

    <ThemesDropdown
      attributeName={`titles.${match.params.locale}`}
      location={location}
      match={match}
    />
    <T.button
      className="sidebar-reset visibility-hidden"
      onClick={() => resetParams(location, match, THEME)}
      text='sidebar.reset'
      context={locale} />

    <ProfilesDropdown attributeName="profileIds" location={location} match={match} />
    <T.button
      className="sidebar-reset visibility-hidden"
      onClick={() => resetParams(location, match, PROFILE)}
      text='sidebar.reset'
      context={locale} />

    <T.button
      className="sidebar-reset sidebar-reset--mobile"
      onClick={() => resetParams(location, match)}
      text='sidebar.resetAll'
      context={locale} />
  </div>


const DesktopSidebar = ({ resetParams, location, match, toggleProfile, toggleTheme, toggleManifesto, showMore, profiles, themes, manifestos, doQuery, toggleMajor, locale }) =>
  <div className="sidebar-group">
    <h3 className="sidebar-title">
      <ToggleSwitch initialChecked={false} onChange={e => toggleMajor(e.target.checked)}>
        {T.translate('dashboard.majorText', {context: locale})}
      </ToggleSwitch>
    </h3>

    <h3 className="sidebar-title">
      {T.translate('browse.filterManifesto', {context: locale})}
    </h3>

    <ManifestoList
      manifestos={manifestos}
      location={location}
      match={match}
      toggleManifesto={toggleManifesto} />

    <h3 className="sidebar-title">
      {T.translate('browse.filterTheme', {context: locale})}
    </h3>
    <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, THEME)}>{T.translate('browse.reset', {context: locale})}</button>

    <ThemesList
      themes={themes}
      location={location}
      match={match}
      toggleTheme={toggleTheme}
      onViewMore={showMore} />

    <Profiles
      location={location}
      locale={match.params.locale}
      toggleProfile={toggleProfile}
      profiles={profiles}
      limitMin={1000}
      attributeName="profileIds">

      <h3 className="sidebar-title">
        {T.translate('browse.filterIam', {context: locale})}
      </h3>
      <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, PROFILE)}>{T.translate('browse.reset', {context: locale})}</button>

    </Profiles>

    <div className="sidebar-search">
      <SearchBox
        onInput={e => doQuery(e.target.value)}
        searchAsYouType={false}
        translations={{placeholder: T.translate('sidebar.query', {context: locale})}}/>
      <button className="sidebar-reset visibility-hidden" onClick={() => resetParams(location, match, QUERY)}>{T.translate('browse.reset', {context: locale})}</button>
      <T.button
        className="sidebar-reset"
        onClick={() => resetParams(location, match)}
        text='sidebar.resetAll'
        context={locale} />
    </div>

    <div className="sidebar-footer">
      <LastUpdated locale={locale} />
    </div>

  </div>

export default class Sidebar extends Component {
  state = {}

  seeMoreRefinements() {
    this.setState({ viewingMore: true });
  }

  render() {
    let { viewingMore } = this.state;
    let { location, match, profiles, themes, manifestos, dispatch, locale } = this.props;
    return (
      <aside className={`sidebar${viewingMore ? ' sidebar-more' : ''}`}>

        <Media query="(min-width: 800px)">
        {matches =>
          matches ?
            <DesktopSidebar
             location={location}
             locale={locale}
             match={match}
             profiles={profiles}
             themes={themes}
             manifestos={manifestos}
             showMore={this.seeMoreRefinements.bind(this)}
             toggleTheme={(...args) => dispatch(toggleTheme(...args))}
             toggleProfile={(...args) => dispatch(toggleProfile(...args))}
             toggleManifesto={(...args) => dispatch(toggleManifesto(...args))}
             doQuery={(...args) => dispatch(doQuery(...args))}
             resetParams={(...args) => dispatch(resetParams(...args))}
             toggleMajor={checked => dispatch(toggleMajor(checked))}
            />
          :
            <MobileSidebar
             location={location}
             locale={locale}
             match={match}
             resetParams={(...args) => dispatch(resetParams(...args))}
             toggleMajor={checked => dispatch(toggleMajor(checked))}
            />
        }
        </Media>

      </aside>
    );
  }
}
