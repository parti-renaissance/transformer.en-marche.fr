import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Select from 'react-select';
import { connectRefinementList, connectStateResults } from 'react-instantsearch/connectors';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import reject from 'lodash/reject';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';

import { Measures, NoMeasure } from './measure';
import { FilterButton } from './sidebar';
import {
  toggleThemeFacet,
  resetParams,
  THEME,
} from '../actions/search-actions';
import '../../scss/dropdowns.css';
import './../../scss/theme.css';

function filterMeasuresForState(measures, {currentTheme, activeProfile, majorOnly, query, locale}) {
  // the measures from state include add'l metadata like vote status
  // pull those out first, using the give theme's `measureIds` array as reference
  measures = filter(measures, m => currentTheme.measureIds.includes(m.id));

  // filter out any measures that aren't "major" if the major filter is selected
  if (majorOnly) {
    measures = filter(measures, 'major');
  }

  // if a profile is currently active, filter out any measures
  // which don't include that profile
  if (activeProfile) {
    measures = filter(measures, m => m.profileIds.includes(activeProfile));
  }

  // if there's a keyword query active, filter according to that
  measures = filter(measures, m => m.titles[locale].match(new RegExp(query, 'gi')));

  return measures.length ? measures : null;
}

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
           label={props.theme.titles[props.locale]}
           isActive={props.theme.isActive}
           onClick={props.refine}
           buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


const ThemeFilters = connectRefinementList(function ThemeFilters({children, themes = [], items = [], toggle, locale}) {

  const createListItems = (theme, i) =>
    <ThemeListItem
      locale={locale}
      theme={theme}
      style={getColor(i)}
      key={theme.id}
      refine={() => toggle(theme)} />

  themes = themes.slice().sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
  let filteredLabels = map(items, 'label');
  let filtered = filter(themes, t => filteredLabels.includes(t.titles[locale]));
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
      attributeName={`titles.${match.params.locale}`}
      limitMin={1000}
      locale={match.params.locale}
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

  componentWillReceiveProps({ activeThemes:nextThemes, themes }) {
    let { activeThemes, locale } = this.props;
    if (!nextThemes.length) {
      this.setState({ value: null, label: null })
    } else if (!isEqual(nextThemes, activeThemes)){
      let active = themes[nextThemes[0]];
      if (active) {
        this.setState({
          value: {
            value: active.id,
            label: active.titles[locale]
          }
        });
      }
    }
  }

  handleChange(selected) {
    let { toggleTheme, themes, match, location, locale, push, resetParams } = this.props;
    let theme = themes[selected.value];

    this.setState(selected);
    resetParams(location, match, THEME);
    push(`${match.url}?theme=${theme.slugs[locale]}`);
    toggleTheme(theme.id);
  }

  render() {
    return <Select
            className="theme-dropdown"
            placeholder="Je m’interesse à…"
            searchable={false}
            clearable={false}
            value={this.state.value}
            options={this.props.themesOptions}
            onChange={this.handleChange.bind(this)}
          />
  }
}

ThemesDropdown = connectRefinementList(ThemesDropdown);

ThemesDropdown = connect(({
  themes: { themes, items, activeThemes },
  locale,
}) => ({
  themesOptions: items.map(id => ({
    label: themes[id].titles[locale], value: id
  })).sort((a, b) => a.label.localeCompare(b.label)),
  themes,
  activeThemes,
  locale
}), dispatch => ({
  push: url => dispatch(push(url)),
  toggleTheme: theme => dispatch(toggleThemeFacet(theme)),
  resetParams: (...args) => dispatch(resetParams(...args))
}))(ThemesDropdown);

export { ThemesDropdown };

class ThemeDetail extends Component {
  state = {
    empty: true
  }

  componentWillReceiveProps(nextProps) {
    let { hit:theme, searchState: { query }, majorOnly, measures, activeProfile, locale } = nextProps;
    measures = filterMeasuresForState(measures, {currentTheme: theme, activeProfile, majorOnly, query, locale});

    if (!measures) {
      this.setState({ empty: true });
    } else {
      let grouped = groupBy(measures, 'status');
      measures = (grouped['DONE'] || [])
                  .concat(grouped['IN_PROGRESS'] || [])
                  .concat(grouped['UPCOMING'] || [])
                  .concat(grouped['DEFERRED'] || []);

      this.setState({ measures, empty: false });
    }
  }

  render() {
    let { hit:theme, locale } = this.props;

    const coverImg = {
      backgroundImage: `url(${IMAGE_URL}/${theme.image})`
    };

    const measures = this.state.empty ? <NoMeasure theme={theme.title} /> : <Measures measures={this.state.measures} />

    return (
      <article className="theme">

        <div style={coverImg} className="theme-image">
          <div className="theme-image__text">{theme.titles[locale]}</div>
        </div>

        <h1 className="theme-title">{theme.titles[locale]}</h1>

        <p className="theme-body">{theme.descriptions[locale]}</p>

        {measures}

      </article>
    )
  }
}

ThemeDetail = connect(({
  majorOnly,
  locale,
  profiles: { activeProfile },
  measures: { measures }
}) => ({ majorOnly, measures, activeProfile, locale}))(connectStateResults(ThemeDetail));

export { ThemeDetail }
