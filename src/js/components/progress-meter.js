import React, { Component } from 'react';

import '../../scss/progress-meter.css';

const ProgressBar = ({ style }) => <div className="progress-bar" style={style} />

export default class ProgressMeter extends Component {
  render() {
    let { current, total, children, className, reverse } = this.props
    
    let progressBarStyle = {
      width: `${(current / total) * 100}%`,
    }
    if (reverse) {
      progressBarStyle.width = (100 - parseInt(progressBarStyle.width, 10)) + '%';
    }
    
    return (
      <div className={`progress-meter ${className || ''}`}>
        <span className="progress-meter__label">{children}</span>
        <ProgressBar style={progressBarStyle} />
      </div>
    )
  }
}
