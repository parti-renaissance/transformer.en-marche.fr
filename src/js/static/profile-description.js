import React from 'react';
import { find } from 'lodash';

const ProfileDescription = ({ profile, profiles }) => {
  let found = find(profiles, ['title', profile]);
  if (found) {
    return (
      <div className="intro">
        <h1 className="intro-header">{found.title}</h1>
        <p>
          {found.description}
        </p>
      </div>
    )
  } else {
    return null;
  }
}

export default ProfileDescription;
