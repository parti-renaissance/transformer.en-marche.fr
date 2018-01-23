import React, { Component } from 'react';
import { connectMenu } from 'react-instantsearch/connectors';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Select from 'react-select';
import filter from 'lodash/filter';
import map from 'lodash/map';
import T from 'i18n-react';

import {
  setProfile,
  resetParams,
  PROFILE
} from '../actions/search-actions';
import { FilterButton } from './sidebar';

class Profiles extends Component {

  state = {
    profiles: []
  }

  shouldComponentUpdate({ items:nextItems, profiles:nextProfiles, currentRefinement:nextRefinment }) {
    let { items, profiles, currentRefinement } = this.props;
    if (nextItems.length !== items.length ||
        nextProfiles.length !== profiles.length ||
        nextRefinment !== currentRefinement)  {
          return true;
        } else {
          return false;
        }
  }

  componentWillReceiveProps(nextProps) {
    let { items, profiles } = nextProps;

    if (!items.length || !profiles.length) {
      this.setState({ profiles: [] });
    } else {
      let ids = map(items, 'value').map(Number);
      profiles = filter(profiles, p => ids.includes(p.id));

      this.setState({ profiles });
    }
  }

  render() {
    let { profiles } = this.state;
    let { toggleProfile, location, locale } = this.props;

    if (!profiles.length && !this.props.profiles.length) {
      return null;
    } else if (!profiles.length){
      profiles = this.props.profiles;
    }

    let buttons = profiles.map((profile, i) => {
      return (
        <li key={profile.id} className="refinement-list__item">
          <FilterButton
            label={profile.titles[locale]}
            isActive={profile.isActive}
            onClick={() => toggleProfile(profile, location, locale)} />
        </li>
      )
    });
    return (
      <div className="profiles">
        {this.props.children}
        <ul className="refinement-list refinement-profiles">
          {buttons}
        </ul>
      </div>
    );
  }

}

Profiles = connectMenu(Profiles);

export { Profiles };


class ProfilesDropdown extends Component {
  state = {}

  constructor(props) {
    super(props);
    let active = props.profiles[props.activeProfile];
    if (active) {
      this.state = {
        value: active.id,
        label: active.title
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeProfile) {
      this.setState({ value: null, label: null })
    } else {
      let { title } = nextProps.profiles[nextProps.activeProfile];
      this.setState({ value: nextProps.activeProfile, label: title});
    }
  }

  handleChange(selected) {
    let {
      toggleProfile,
      profiles,
      match,
      location,
      push,
      resetParams
    } = this.props;
    let { locale } = match.params;
    let profile = profiles[selected.value];

    this.setState(selected);
    resetParams(location, match, PROFILE);
    push(`/${locale}/${profile.slugs[locale]}${location.search}`)
    toggleProfile(profile.id);
  }

  render() {
    let { locale } = this.props.match.params;
    return <Select
            className="profile-dropdown"
            placeholder={T.translate('browse.filterIam', {context: locale})}
            searchable={false}
            clearable={false}
            value={this.state.value}
            options={this.props.profileOptions}
            onChange={this.handleChange.bind(this)}
          />
  }
};

ProfilesDropdown = connectMenu(ProfilesDropdown);

ProfilesDropdown = connect(({
  locale,
  profiles: { profiles, items, activeProfile }
}) => ({
  profileOptions: items.map(id => ({
    label: profiles[id].titles[locale], value: id
  })).sort((a, b) => a.label.localeCompare(b.label)),
  profiles,
  activeProfile
}), dispatch => ({
  push: url => dispatch(push(url)),
  toggleProfile: profile => dispatch(setProfile(profile)),
  resetParams: (...args) => dispatch(resetParams(...args))
}))(ProfilesDropdown);

export { ProfilesDropdown };
