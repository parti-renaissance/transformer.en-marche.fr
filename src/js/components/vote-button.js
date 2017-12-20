import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import '../../scss/vote-button.css';

export default class VoteButton extends Component {
  render() {
    let { isActive, onClick } = this.props;
    return (
      <button onClick={onClick} className={`vote-button${isActive ? ' is-active' : ''}`}>
        <ReactSVG className="thumbs-up" path="/assets/svg/thumbs-up.svg" />
      </button>
    )
  }
}
