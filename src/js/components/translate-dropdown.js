import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { setLocale } from '../actions/translate-actions';

const OPTIONS = {
  fr: {
    value: 'fr',
    label: 'Français'
  },
  en: {
    value: 'en',
    label: 'English'
  }
};

const ABBREVIATED_OPTIONS = {
  fr: {
    value: 'fr',
    label: 'FR'
  },
  en: {
    value: 'en',
    label: 'EN'
  }
}

export default class TranslateDropdown extends connect()(Component) {
  
  componentWillReceiveProps(nextProps) {
    if (this.props.small !== nextProps.small) {
      this.updateForSize(nextProps);
    }
  }
  componentWillMount() {
    this.updateForSize(this.props);
  }
  
  updateForSize({ small }) {
    if (small) {
      let { value, label } = ABBREVIATED_OPTIONS[this.props.selected] || {};
      this.setState({
        selected: {
          value: value,
          label: label
        },
        options: [ABBREVIATED_OPTIONS.fr, ABBREVIATED_OPTIONS.en]
      });
    } else {
      let { value, label } = OPTIONS[this.props.selected] || {};
      this.setState({
        selected: {
          value: value,
          label: label
        },
        options: [OPTIONS.fr, OPTIONS.en]
      });
    }
  }
  
  handleChange = this.handleChange.bind(this)
  
  handleChange(selected) {
    this.store.dispatch(setLocale(selected.value, this.props.location));
    this.setState({ selected });
  }
  
  render() {
    return <Select
            className="translate-dropdown"
            searchable={false}
            clearable={false}
            value={this.state.selected}
            options={this.state.options}
            onChange={this.handleChange}
          />
  }
}
