import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import ReactSVG from 'react-svg';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { connectMenu } from 'react-instantsearch/connectors';

import { FilterButton } from './sidebar';

import {
  toggleManifesto,
} from '../actions/search-actions';

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

export const ManifestoList = ({ manifestos, toggleManifesto, location, match }) =>
  <ul className="refinement-list">
    <ManifestoFilters
      attributeName="manifestoIds"
      limitMin={1000}
      locale={match.params.locale}
      manifestos={manifestos}
      toggle={manifesto => toggleManifesto(manifesto, location, match)}
    />
  </ul>


class ManifestoFilters extends Component {
  state = {
    activeManifestos: [],
  }

  createListItems = this.createListItems.bind(this)

  shouldComponentUpdate(props) {
    let {
      activeManifestos:nextActive,
    } = this.filterManifestos(props.manifestos, props.items, props.locale);

    let {
      activeManifestos,
    } = this.state;

    if (nextActive.length !== activeManifestos.length ||
        props.locale !== this.props.locale) {
          return true;
        } else {
          return false;
        }
  }

  componentWillReceiveProps({ manifestos, items, locale }) {
    this.setState(this.filterManifestos(manifestos, items, locale));
  }

  filterManifestos(manifestos, themes, locale) {
    manifestos.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
    let filteredLabels = map(themes, 'label')
    let filtered = filter(manifestos, t => filteredLabels.includes(t.titles[locale]));

    return {
      activeManifestos: filter(filtered, 'isActive'),
    };
  }

  createListItems(manifesto) {
    return <ManifestoListItem
            locale={this.props.locale}
            manifesto={manifesto}
            key={manifesto.id}
            refine={() => this.props.toggle(manifesto)} />
  }

  render() {
    let { activeManifestos } = this.state;

    return activeManifestos.map(this.createListItems)
      .concat(this.props.children);
  }
}

ManifestoFilters = connectMenu(ManifestoFilters);

class ManifestoListItem extends Component {
  state = {}

  measureButton() {
    let textWidth = this.button.children[0].getBoundingClientRect().width;
    this.setState({style: {flexBasis: textWidth + 24}});
  }

  componentDidMount() {
    this.measureButton();
  }

  componentWillReceiveProps() {
    this.measureButton();
  }

  shouldComponentUpdate(props) {
    if (props.manifesto.isActive !== this.props.manifesto.isActive) {
      return true;
    } else {
      return false
    }
  }

  render() {
    let { props, state } = this;
    return (
      <li className={`refinement-list__item ${props.className || ''}`} style={state.style}>
        {props.children ||
          <FilterButton
           label={props.manifesto.titles[props.locale]}
           isActive={props.manifesto.isActive}
           onClick={props.refine}
           buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


export class ManifestoDropdown extends Component {

}
