import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import ReactSVG from 'react-svg';


const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

const PRESIDENTIAL_MANIFESTO = 2;
const EUROPEAN_MANIFESTO = 3;
const OUT_OF_MANIFESTO = 4;

const MANIFESTO_SVGS = {
  [PRESIDENTIAL_MANIFESTO]: `${rootPath}/assets/svg/manifesto-presidentielle.svg`,
  [EUROPEAN_MANIFESTO]: `${rootPath}/assets/svg/manifesto-europeennes.svg`,
  [OUT_OF_MANIFESTO]: `${rootPath}/assets/svg/manifesto-additional.svg`,
}

export default class ManifestoIcon extends Component {
  render() {
    const { locale, manifesto: { titles, id} } = this.props;
    return (
      <div className="measure-manifesto" data-tip={titles[locale]}>
        <ReactTooltip
          place="top"
          type="light"
          effect="solid"
          className="measure-manifesto__tooltip"
        />
        <ReactSVG
          className="measure-manifesto__icon"
          path={MANIFESTO_SVGS[id]}
        />
      </div>
    )
  }
}
