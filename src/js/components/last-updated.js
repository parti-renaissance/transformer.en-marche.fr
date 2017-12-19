import React from 'react';
import { map } from 'lodash';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

const LastUpdated = ({ measures: { measures }, className }) => {
  let dates = map(measures, 'updatedAt');
  dates.sort();
  let diff = moment().diff(dates[0], 'days');
  let unit = 'jours';
  if (diff < 1) {
    diff = moment().diff(dates[0], 'hours');
    unit = 'hours';
  }
  return <small className={className}>Dernière mise à jour il y a {diff} {unit}.</small>
};

export default connect(state => ({measures: state.measures}))(LastUpdated);
