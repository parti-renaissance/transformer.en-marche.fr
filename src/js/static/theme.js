import React from 'react';
import { Measures, NoMeasure } from './measure';

import './../../scss/theme.css';
  
const Theme = ({hit:theme}) => {
  let measures = (
    <Measures measures={theme.measures}>
      <NoMeasure theme={theme.title} />
    </Measures>
  );
  
  if (!measures) {
    return null;
  }
  
  return (
    <article className="theme">
      <img src={theme.image} className="theme-image" alt={theme.title} />
      
      <h1 className="theme-title">{theme.title}</h1>
      
      <p className="theme-body">{theme.description}</p>
      
      {measures}
        
    </article>
  )
}

export default Theme;
