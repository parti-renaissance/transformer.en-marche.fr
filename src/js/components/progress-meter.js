import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';

import '../../scss/progress-meter.css';

const duration = 225;

const ProgressBar = ({ width }) => (
  <Transition in={true} timeout={duration} appear={true}>
    {(state) => (
      <div className="progress-bar" style={{
        transition: `width ${duration}ms ease-out 500ms`,
        width: state === 'entering' ? '0%' : width
      }} />
    )}
  </Transition>
)

export default class ProgressMeter extends Component {
  render() {
    let { current, total, children, className, reverse } = this.props
    
    let targetWidth = `${(current / total) * 100}%`;
    if (reverse) {
      targetWidth = (100 - parseInt(targetWidth, 10)) + '%';
    }
    
    return (
      <div className={`progress-meter ${className || ''}`}>
        <span className="progress-meter__label">{children}</span>
        <ProgressBar width={targetWidth} />
      </div>
    )
  }
}
