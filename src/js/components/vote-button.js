import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import '../../scss/vote-button.css';

const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

export default class VoteButton extends Component {
  onClick = () => {
    this.props.isActive ? this.props.voteDown() : this.props.voteUp();
    this.node.blur();
  }
  
  render() {
    let { isActive, classNames } = this.props;
    let classes = `vote-button${isActive ?  ' is-active' : ''} ${classNames}`;
    return (
      <button
        ref={node => this.node = node}
        onClick={this.onClick} className={classes}>
        <ReactSVG className="thumbs-up" path={`${rootPath}/assets/svg/thumbs-up.svg`} />
      </button>
    )
  }
}
