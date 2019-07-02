import React from 'react';
import ReactSVG from 'react-svg';

import '../../scss/banner.css';


const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

const Banner = props =>
  <div className="banner">
    <div className="banner__left">
      {props.children}
    </div>

    <div className="banner__right">
      <button onClick={props.close} className="banner-close">
        <ReactSVG
          className="banner-icon"
          path={`${rootPath}/assets/svg/close.svg`}
        />
      </button>
    </div>
  </div>


export default Banner;
