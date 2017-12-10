import React from 'react';
import { find } from 'lodash';

const ProfileDescription = ({ profile, profiles }) => {
  let found = find(profiles, ['title', profile]);
  return found ? <p>{found.description}</p> : null;
}

export default ProfileDescription;
