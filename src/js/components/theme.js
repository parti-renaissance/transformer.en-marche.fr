import React from 'react';
import { groupBy, filter } from 'lodash';
import { Measures, NoMeasure } from './measure';
import { connectStateResults } from 'react-instantsearch/connectors';

import './../../scss/theme.css';
  
const Theme = connectStateResults(({ hit:theme, searchState: { query } }) => {
  let { measures } = theme;

  measures = filter(measures, m => m.title.match(new RegExp(query, 'gi')));
  let grouped = groupBy(measures, 'status');
  measures = (grouped['IS_LAW'] || [])
                .concat(grouped['IN_PROGRESS'] || [])
                .concat(grouped['VOTED'] || []);
  
  if (query && !measures.length) {
    // no matching measures for this keyword query
    // return nothing so it doesn't render
    return null;
  }
  
  return (
    <article className="theme">
      <img src={theme.image} className="theme-image" alt={theme.title} />
      
      <h1 className="theme-title">{theme.title}</h1>
      
      <p className="theme-body">{theme.description}</p>
      
      {measures.length ?
        <Measures measures={measures} />
      : <NoMeasure theme={theme.title} />}
        
    </article>
  )
});

export default Theme;
