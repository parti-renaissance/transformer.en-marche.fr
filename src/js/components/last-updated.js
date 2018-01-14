import React, { Component } from 'react';
import { map } from 'lodash';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

class LastUpdated extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.measures.items.length !== this.props.measures.items.length;
  }

  render() {
    let { measures: { measures }, className } = this.props;
    let dates = map(measures, 'formattedUpdatedAt');
    dates.sort();
    let diff = moment().diff(dates[0], 'days');
    let unit = 'jour(s)';
    if (diff < 1) {
      diff = moment().diff(dates[0], 'hours');
      unit = 'heure(s)';
    }
    return <small className={className}>Mis à jour il y a {diff} {unit}.</small>
  }

}

export default connect(state => ({measures: state.measures}))(LastUpdated);
