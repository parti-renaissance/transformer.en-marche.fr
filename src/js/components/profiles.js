import React, { Component } from 'react';
import { connectMenu } from 'react-instantsearch/connectors';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Select from 'react-select';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import map from 'lodash/map';

import {
  setProfile,
  resetParams,
  PROFILE
} from '../actions/search-actions';
import { FilterButton } from './sidebar';

export const Profiles = connectMenu(function Profiles({items, profiles, toggleProfile, location, locale}) {
  let filteredLabels = map(items, 'label')
  let filtered = filter(profiles, p => filteredLabels.includes(p.title));
  let list = filtered.map((profile, i) => {
    return (
      <li key={profile.objectID} className="refinement-list__item">
        <FilterButton
          label={profile.title}
          isActive={profile.isActive}
          onClick={() => toggleProfile(profile, location, locale)} />
      </li>
    )
  });
  return <ul className="refinement-list refinement-profiles">{list}</ul>
});
  

class ProfilesDropdown extends Component {
  state = {}
  
  constructor(props) {
    super(props);
    let active = props.profiles[props.activeProfile];
    if (active) {
      this.state.value = {
        value: active.objectID,
        label: active.title
      };
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeProfile) {
      this.setState({ value: null, label: null })
    }
  }
  
  handleChange = selected => {
    let { toggleProfile, profiles, match, location, push, resetParams } = this.props;
    let profile = profiles[selected.value];
    
    this.setState(selected);
    resetParams(location, match, PROFILE);
    push(`/${match.params.locale}/results${location.search}`)
    toggleProfile(profile.objectID);
  }
  
  render() {
    return <Select
            className="profile-dropdown"
            placeholder="Je suis..."
            searchable={false}
            clearable={false}
            value={this.state.value}
            options={this.props.profileOptions}
            onChange={this.handleChange}
          />
  }
};

ProfilesDropdown = connectMenu(ProfilesDropdown);

ProfilesDropdown = connect(({ profiles: { profiles, items, activeProfile }}) => ({
  profileOptions: sortBy(items.map(id => ({label: profiles[id].title, value: id})), 'label'),
  profiles,
  activeProfile
}), dispatch => ({
  push: url => dispatch(push(url)),
  toggleProfile: profile => dispatch(setProfile(profile)),
  resetParams: (...args) => dispatch(resetParams(...args))
}))(ProfilesDropdown);

export { ProfilesDropdown };
