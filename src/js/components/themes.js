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
import T from 'i18n-react';

import { Measures, NoMeasure } from './measure';
import { FilterButton } from './sidebar';
import {
  toggleThemeFacet,
  resetParams,
  THEME,
} from '../actions/search-actions';
import '../../scss/dropdowns.css';
import './../../scss/theme.css';

function filterMeasuresForState(measures, {currentTheme, activeProfile, activeManifestos, majorOnly, query, locale}) {
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

  // if a manifest is active, filter any measures that aren't linked to that manifesto
  if (activeManifestos.length) {
    measures = filter(measures, m => activeManifestos.includes(m.manifestoId));
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

  shouldComponentUpdate(props) {
    if (props.theme.isActive !== this.props.theme.isActive) {
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
           label={props.theme.titles[props.locale]}
           isActive={props.theme.isActive}
           onClick={props.refine}
           buttonRef={e => this.button = e} />}
      </li>
    )
  }
}


class ThemeFilters extends Component {
  state = {
    activeThemes: [],
    featuredThemes: [],
    otherThemes: [],
  }

  createListItems = this.createListItems.bind(this)

  shouldComponentUpdate(props) {
    let {
      activeThemes:nextActive,
      featuredThemes:nextFeatured,
      otherThemes:nextOther
    } = this.filterThemes(props.themes, props.items, props.locale);

    let {
      activeThemes,
      featuredThemes,
      otherThemes,
    } = this.state;

    if (nextActive.length !== activeThemes.length ||
        nextFeatured.length !== featuredThemes.length ||
        nextOther.length !== otherThemes.length ||
        props.locale !== this.props.locale) {
          return true;
        } else {
          return false;
        }
  }

  componentWillReceiveProps({ themes, items, locale }) {
    this.setState(this.filterThemes(themes, items, locale));
  }

  filterThemes(themes, items, locale) {
    themes.sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));
    let filteredLabels = map(items, 'label')
    let filtered = filter(themes, t => filteredLabels.includes(t.titles[locale]));

    let inactiveThemes = reject(filtered, 'isActive')

    return {
      activeThemes:   filter(filtered, 'isActive'),
      featuredThemes: filter(inactiveThemes, 'featured'),
      otherThemes:    reject(inactiveThemes, 'featured')
    };
  }

  createListItems(theme) {
    return <ThemeListItem
            locale={this.props.locale}
            theme={theme}
            key={theme.id}
            refine={() => this.props.toggle(theme)} />
  }

  render() {
    let { activeThemes, featuredThemes, otherThemes } = this.state;

    return activeThemes.map(this.createListItems)
      .concat(featuredThemes.map(this.createListItems))
      .concat(this.props.children)
      .concat(otherThemes.map(this.createListItems));
  }
}

ThemeFilters = connectRefinementList(ThemeFilters);

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
          {T.translate('measures.allthemes', {context: match.params.locale})}
        </FilterButton>
      </li>

    </ThemeFilters>
  </ul>

class ThemesDropdown extends Component {
  constructor(props) {
    super(props);
    if (props.activeThemes.length && props.themes.length) {
      let active = props.themes[props.activeThemes[0]]
      this.state = {
        value: {
          value: active.id,
          label: active.titles[props.locale]
        }
      }
    }
  }

  state = {
    value: {
      value: this.props.activeThemes[0],
      lable: this.props.themes
    }
  }

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
            placeholder={T.translate('browse.filterTheme', {context: this.props.locale})}
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
    let { hit:theme, searchState: { query }, majorOnly, measures, activeProfile, activeManifestos, locale } = nextProps;
    measures = filterMeasuresForState(measures, {currentTheme: theme, activeProfile, activeManifestos, majorOnly, query, locale});

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
    let { hit:theme, isFiltering, locale } = this.props;

    const coverImg = {
      backgroundImage: `url(${IMAGE_URL}/${theme.image})`
    };

    const measures = this.state.empty ? <NoMeasure theme={theme.title} locale={locale} /> : <Measures measures={this.state.measures} />

    return (
      <article className="theme">

        <div style={coverImg} className="theme-image">
          <div className="theme-image__text">{theme.titles[locale]}</div>
        </div>

        <h1 className="theme-title">{theme.titles[locale]}</h1>

        {!isFiltering &&
          <p className="theme-body">{theme.descriptions[locale]}</p>
        }
        {measures}

      </article>
    )
  }
}

ThemeDetail = connect(({
  majorOnly,
  locale,
  profiles: { activeProfile },
  measures: { measures },
  manifestos: { activeManifestos },
}) => ({ majorOnly, measures, activeProfile, activeManifestos, locale}))(connectStateResults(ThemeDetail));

export { ThemeDetail }
