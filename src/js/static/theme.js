import React from 'react';
import { Measures, NoMeasure } from './measure';

import './../../scss/theme.css';
  
const Theme = ({hit:theme}) =>
  <article className="theme">
    <img src={theme.image} className="theme-image" alt={theme.title} />
    
    <h1 className="theme-title">{theme.title}</h1>
    
    <p className="theme-body">{theme.description}</p>
      
    <Measures measures={theme.measures}>
      <NoMeasure theme={theme.title} />
    </Measures>
  </article>

export default Theme;
