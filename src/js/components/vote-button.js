import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import '../../scss/vote-button.css';

export default class VoteButton extends Component {
  onClick = () => {
    this.props.isActive ? this.props.voteDown() : this.props.voteUp();
    this.node.blur();
  }
  
  render() {
    let { isActive } = this.props;
    return (
      <button
        ref={node => this.node = node}
        onClick={this.onClick} className={`vote-button${isActive ? ' is-active' : ''}`}>
        <ReactSVG className="thumbs-up" path="/assets/svg/thumbs-up.svg" />
      </button>
    )
  }
}
