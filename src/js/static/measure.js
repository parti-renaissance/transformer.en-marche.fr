import React from 'react';

import '../../scss/measure.css';

const STATUS_MAP = {
  IN_PROGRESS: 'En vigueur',
  IS_LAW: 'Voté',
  VOTED: 'En cours'
}

const slugify = str => str.toLowerCase().replace(/\s/g, '-');

export const Measure = ({measure}) =>
  <a
    href="http://www.wnyc.org"
    target="_blank"
    rel="noreferrer noopener"
    className={`measure ${slugify(STATUS_MAP[measure.status])}`}>
    <div className="measure-body">
      <div className="measure-status">
        {STATUS_MAP[measure.status]}
      </div>
      <div className="measure-name">
        {measure.title}
      </div>
    </div>
  </a>
  
export const NoMeasure = ({theme}) =>
  <p className="no-measure">Il n&apos;y a pas de réformes specifiques au profil de {theme}. Voir toutes les réformes sur le thème {theme}.</p>

export function Measures({ measures = [], children }) {
  if (!measures.length) {
    return children;
  }
  return (
    <div className="measure-list">
      {measures.map((measure, i) => <Measure key={i} measure={measure} />)}
    </div>
  )
}
