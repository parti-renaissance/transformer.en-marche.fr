import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Select from 'react-select';
import { connectRefinementList, connectStateResults } from 'react-instantsearch/connectors';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import reject from 'lodash/reject';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { Measures, NoMeasure } from './measure';
import { FilterButton, getColor } from './sidebar';
import {
  toggleThemeFacet,
  resetParams,
  THEME,
} from '../actions/search-actions';
import '../../scss/dropdowns.css';
import './../../scss/theme.css';

// eslint-disable-next-line
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;


class ThemeListItem extends Component {
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

  render() {
    let { props, state } = this;
    return (
      <li className={`refinement-list__item ${props.className || ''}`} style={state.style}>
        {props.children ||
          <FilterButton
           style={props.style}
           label={props.theme.title}
           isActive={props.theme.isActive}
           onClick={props.refine}
           buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


const ThemeFilters = connectRefinementList(function ThemeFilters({children, themes = [], items = [], toggle}) {

  const createListItems = (theme, i) =>
    <ThemeListItem
      theme={theme}
      style={getColor(i)}
      key={theme.objectID}
      refine={() => toggle(theme)} />

  let filteredLabels = map(items, 'label')
  let filtered = filter(themes, t => filteredLabels.includes(t.title));
  let activeThemes = filter(filtered, 'isActive').map(createListItems);

  let inActiveThemes = reject(filtered, 'isActive')
  let featuredThemes = filter(inActiveThemes, 'featured').map(createListItems);
  let otherThemes = reject(inActiveThemes, 'featured').map(createListItems);

  return activeThemes
    .concat(featuredThemes)
    .concat(children)
    .concat(otherThemes);
});

export const ThemesList = ({ onViewMore, themes, toggleTheme, location, match }) =>
  <ul className="refinement-list">
    <ThemeFilters
      attributeName="title"
      limitMin={1000}
      themes={themes}
      toggle={theme => toggleTheme(theme, location, match)}>

      <li className="refinement-list__item refinement-list__item-more">
        <FilterButton onClick={onViewMore} style={{backgroundColor: 'rgba(111, 129, 255, .5)', color: 'white'}}>
          Voir tous les thèmes
        </FilterButton>
      </li>

    </ThemeFilters>
  </ul>

class ThemesDropdown extends Component {
  state = {}

  constructor(props) {
    super(props);
    let active = props.themes[props.activeThemes[0]];
    if (active) {
      this.state.value = {
        value: active.objectID,
        label: active.title
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeThemes.length) {
      this.setState({ value: null, label: null })
    }
  }

  handleChange = selected => {
    let { toggleTheme, themes, match, location, push, resetParams } = this.props;
    let theme = themes[selected.value];

    this.setState(selected);
    resetParams(location, match, THEME);
    push(`${match.url}?theme=${theme.slug}`);
    toggleTheme(theme.objectID);
  }

  render() {
    return <Select
            className="theme-dropdown"
            placeholder="Je m’interesse à…"
            searchable={false}
            clearable={false}
            value={this.state.value}
            options={this.props.themesOptions}
            onChange={this.handleChange}
          />
  }
}

ThemesDropdown = connectRefinementList(ThemesDropdown);

ThemesDropdown = connect(({ themes: { themes, items, activeThemes }}) => ({
  themesOptions: sortBy(items.map(id => ({label: themes[id].title, value: id})), 'label'),
  themes,
  activeThemes
}), dispatch => ({
  push: url => dispatch(push(url)),
  toggleTheme: theme => dispatch(toggleThemeFacet(theme)),
  resetParams: (...args) => dispatch(resetParams(...args))
}))(ThemesDropdown);

export { ThemesDropdown };

let ThemeDetail = connectStateResults(function ThemeDetail({ hit:theme, searchState: { query }, majorOnly }) {
  let { measures } = theme;

  measures = filter(measures, m => m.title.match(new RegExp(query, 'gi')));
  if (majorOnly) {
    measures = filter(measures, 'global');
  }
  //  let promoted = filter(measures, 'global');
  //  let theRest = reject(measures, 'global');
  //  let grouped = groupBy(theRest, 'status');
  let grouped = groupBy(measures, 'status');
  measures = (grouped['DONE'] || [])
                .concat(grouped['IN_PROGRESS'] || [])
                .concat(grouped['UPCOMING'] || []);

  if (query && !measures.length) {
    // no matching measures for this keyword query
    // return nothing so it doesn't render
    return null;
  }

  const coverImg = {
    // eslint-disable-next-line
    backgroundImage: `url(${IMAGE_URL}/${theme.image})`
  };

  return (
    <article className="theme">

      <div style={coverImg} className="theme-image">
        <div className="theme-image__text">{theme.title}</div>
      </div>

      <h1 className="theme-title">{theme.title}</h1>

      <p className="theme-body">{theme.description}</p>

      {measures.length ?
        <Measures measures={measures} />
      : <NoMeasure theme={theme.title} />}

    </article>
  )
});

ThemeDetail = connect(({ majorOnly }) => ({ majorOnly }))(ThemeDetail);

export { ThemeDetail }
