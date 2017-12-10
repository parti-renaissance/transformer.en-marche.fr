import React from 'react';
import { Index } from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch/connectors';
import { map, sortBy } from 'lodash';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/Paris');

const MostRecentMeausure = connectHits(({ hits }) => {
  let dates = map(hits, 'updatedAt');
  dates.sort();
  let diff = moment().diff(dates[0], 'days');
  return <small>Dernière mise à jour il y a {diff} jours.</small>
});

export default () =>
  <Index indexName="Measure_dev">
    <MostRecentMeausure />
  </Index>
