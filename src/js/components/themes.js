import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Select from 'react-select';
import { connectRefinementList, connectStateResults } from 'react-instantsearch/connectors';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import reject from 'lodash/reject';
import map from 'lodash/map';

import { Measures, NoMeasure } from './measure';
import { FilterButton } from './sidebar';
import {
  toggleThemeFacet,
  resetParams,
  THEME,
} from '../actions/search-actions';
import '../../scss/dropdowns.css';
import './../../scss/theme.css';

function filterMeasuresForState(measures, {currentTheme, activeProfile, majorOnly, query}) {
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
  measures = filter(measures, m => m.title.match(new RegExp(query, 'gi')));
  
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
           label={props.theme.title}
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
    } = this.filterThemes(props.themes, props.items);
    
    let {
      activeThemes,
      featuredThemes,
      otherThemes,
    } = this.state;
    
    if (nextActive.length !== activeThemes.length ||
        nextFeatured.length !== featuredThemes.length ||
        nextOther.length !== otherThemes.length) {
          return true;
        } else {
          return false;
        }
  }
  
  componentWillReceiveProps({ themes, items }) {
    this.setState(this.filterThemes(themes, items));
  }
  
  filterThemes(themes, items) {
    let filteredLabels = map(items, 'label')
    let filtered = filter(themes, t => filteredLabels.includes(t.title));
    
    let activeThemes = filter(filtered, 'isActive');

    let inActiveThemes = reject(filtered, 'isActive')
    let featuredThemes = filter(inActiveThemes, 'featured');
    let otherThemes = reject(inActiveThemes, 'featured');
    
    return {activeThemes, featuredThemes, otherThemes};
  }
  
  createListItems(theme) {
    return <ThemeListItem
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
        value: active.id,
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
            onChange={this.handleChange}
          />
  }
}

ThemesDropdown = connectRefinementList(ThemesDropdown);

ThemesDropdown = connect(({ themes: { themes, items, activeThemes }}) => ({
  themesOptions: items.map(id => ({label: themes[id].title, value: id})).sort((a, b) => a.label.localeCompare(b.label)),
  themes,
  activeThemes
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
    let { hit:theme, searchState: { query }, majorOnly, measures, activeProfile } = nextProps;
    measures = filterMeasuresForState(measures, {currentTheme: theme, activeProfile, majorOnly, query});
    
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
    let { hit:theme } = this.props;

    const coverImg = {
      backgroundImage: `url(${IMAGE_URL}/${theme.image})`
    };
    
    const measures = this.state.empty ? <NoMeasure theme={theme.title} /> : <Measures measures={this.state.measures} />

    return (
      <article className="theme">

        <div style={coverImg} className="theme-image">
          <div className="theme-image__text">{theme.title}</div>
        </div>

        <h1 className="theme-title">{theme.title}</h1>

        <p className="theme-body">{theme.description}</p>

        {measures}

      </article>
    )
  }
}

ThemeDetail = connect(({
  majorOnly,
  profiles: { activeProfile },
  measures: { measures }
}) => ({ majorOnly, measures, activeProfile }))(connectStateResults(ThemeDetail));

export { ThemeDetail }
