import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import ReactSVG from 'react-svg';
import Select from 'react-select';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import T from 'i18n-react';
import { connectMenu } from 'react-instantsearch/connectors';

import { FilterButton } from './sidebar';

import {
  toggleManifestoFacet,
  resetParams,
  MANIFESTO,
} from '../actions/search-actions';

import {
  PRESIDENTIAL_MANIFESTO,
  EUROPEAN_MANIFESTO,
  OUT_OF_MANIFESTO,
} from '../reducers/manifestos-reducer';


const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

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
    visibleManifestos: [],
  }

  shouldComponentUpdate(props) {
    let nextVisibleManifestos = this.filterManifestos(props.manifestos, props.items, props.locale);

    let {
      visibleManifestos,
    } = this.state;

    if (nextVisibleManifestos.length !== visibleManifestos.length ||
        props.locale !== this.props.locale) {
          return true;
        } else {
          return false;
        }
  }

  componentWillReceiveProps({ manifestos, items, locale }) {
    this.setState(this.filterManifestos(manifestos, items, locale));
  }

  filterManifestos(manifestos, items, locale) {
    manifestos.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
    let filteredLabels = map(items, 'label')
    let visibleManifestos = filter(manifestos, m => filteredLabels.includes(String(m.id)));

    return { visibleManifestos };
  }

  render() {
    let { visibleManifestos } = this.state;

    return visibleManifestos.map(manifesto =>
      <ManifestoListItem
        locale={this.props.locale}
        manifesto={manifesto}
        key={manifesto.id}
        refine={() => this.props.toggle(manifesto)} />
    );
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
      <li className="refinement-list__item refinement-list__item--manifesto" style={state.style}>
        {props.children ||
          (<FilterButton
            isActive={props.manifesto.isActive}
            onClick={props.refine}
            buttonRef={e => this.button = e}>
            <ReactSVG
              className="measure-manifesto__icon"
              path={MANIFESTO_SVGS[props.manifesto.id]}
            />
            <span>{props.manifesto.titles[props.locale]}</span>
          </FilterButton>
         )}
      </li>
    )
  }
}


class ManifestoDropdown extends Component {
  state = {}

  constructor(props) {
    super(props);

    if (props.activeManifestos.length && props.manifestos.length) {
      let active = props.manifestos[props.activeManifestos[0]];
      this.state = {
        value: active.id,
        label: active.titles[props.locale],
      }
    }
  }

  componentWillReceiveProps({ activeManifestos:nextManifestos, manifestos }) {
    let { activeManifestos, locale } = this.props;
    if (!nextManifestos.length) {
      this.setState({ value: null, label: null })
    } else if (!isEqual(nextManifestos, activeManifestos)){
      let active = manifestos[activeManifestos[0]];
      if (active) {
        this.setState({
          value: active.id,
          label: active.titles[locale]
        });
      }
    }
  }

  handleChange(selected) {
    let { toggleManifesto, manifestos, match, location, locale, push, resetParams } = this.props;
    let manifesto = manifestos[selected.value];

    this.setState(selected);
    resetParams(location, match, MANIFESTO);
    push(`${match.url}?manifesto=${manifesto.slugs[locale]}`);
    toggleManifesto(manifesto.id);
  }

  render() {
    return <Select
            className="theme-dropdown"
            placeholder={T.translate('browse.filterManifesto', {context: this.props.locale})}
            searchable={false}
            clearable={false}
            value={this.state.value}
            options={this.props.manifestoOptions}
            onChange={this.handleChange.bind(this)}
          />
  }

}

ManifestoDropdown = connectMenu(ManifestoDropdown);

ManifestoDropdown = connect(({
  locale,
  manifestos: { manifestos, items, activeManifestos },
}) => ({
  manifestoOptions: items.map(id => ({
    label: manifestos[id].titles[locale], value: id,
  })).sort((a, b) => a.label.localeCompare(b.label)),
  manifestos,
  activeManifestos,
  locale,
}), dispatch => ({
  push: url => dispatch(push(url)),
  toggleManifesto: manifesto => dispatch(toggleManifestoFacet(manifesto)),
  resetParams: (...args) => dispatch(resetParams(...args)),
}))(ManifestoDropdown);

export { ManifestoDropdown };
