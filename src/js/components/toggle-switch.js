import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import '../../scss/toggle-switch.css';

export default class ToggleSwitch extends Component {
  state = { checked: true }
  
  onChange(e) {
    this.setState({ checked: !this.state.checked });
    this.props.onChange(e);
  }
  
  componentWillMount() {
    this.setState({id: uniqueId('toggle-switch_')});
  }
  
  render() {
    return (
      <div className="toggle-switch">
        {this.props.children}
        <input
         id={this.state.id}
         className="toggle-switch__input"
         type="checkbox"
         checked={this.state.checked}
         onChange={this.onChange.bind(this)} />
        <label htmlFor={this.state.id} className="toggle-switch__label" />
      </div>
    );
  }
}
