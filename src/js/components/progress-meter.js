import React, { Component } from 'react';
import Color from 'color';

import '../../scss/progress-meter.css';

const ProgressBar = ({ style }) =>
  <div className="progress-bar" style={style} />

export default class ProgressMeter extends Component {
  render() {
    let { current, total, children, className, colors, reverse } = this.props
    let color = Color(colors.fill);
    let backgroundColor = color.rgb().alpha(0.1).string();
    let textColor = color.rgb().string();
    
    let progressBarStyle = {
      width: `${(current / total) * 100}%`,
      backgroundColor: color.rgb().alpha(0.9).string()
    }
    if (reverse) {
      progressBarStyle.width = (100 - parseInt(progressBarStyle.width, 10)) + '%';
    }
    
    return (
      <div className={`progress-meter ${className || ''}`} style={{backgroundColor, color: textColor}}>
        <span className="progress-meter__label" style={{color: colors.fill}}>{children}</span>
        <ProgressBar style={progressBarStyle} />
      </div>
    )
  }
}
