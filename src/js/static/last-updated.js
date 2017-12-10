import React from 'react';
import { map } from 'lodash';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/Paris');

const LastUpdated = ({ measures }) => {
  let dates = map(measures, 'updatedAt');
  dates.sort();
  let diff = moment().diff(dates[0], 'days');
  return <small>Dernière mise à jour il y a {diff} jours.</small>
};

export default LastUpdated;
