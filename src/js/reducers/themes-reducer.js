import without from 'lodash/without';

import { TOGGLE_THEME_FACET, RESET_PARAMS, THEME } from '../actions/search-actions';
import { INDEXES } from '../actions/data-actions';

export default function themesReducer(state = {
  items: [],
  activeThemes: [],
  themes: {},
  searchState: {
    refinementList: {title: []}
  },
  fetching: false,
  fetched: false,
  error: null  
}, action) {
  
  switch(action.type) {
    case `${INDEXES}_PENDING`:
      return {...state, fetching: true};
      
    case `${INDEXES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};
      
    case `${INDEXES}_FULFILLED`:
      let { themes } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: themes.map(theme => theme.objectID),
        themes: themes.reduce((s, t) => ({
          ...s,
          [t.objectID]: Object.assign({}, state.themes[t.objectID], t)
        }), {})
      };
      
    case TOGGLE_THEME_FACET:
      let currentTitles = state.searchState.refinementList.title;
      let { title, isActive } = state.themes[action.payload];
      let becomingActive = !isActive;
      
      return {
        ...state,
        themes: Object.assign({}, state.themes, {
          [action.payload]: {
            ...state.themes[action.payload],
            isActive: becomingActive
          }
        }),
        searchState: {
          refinementList: {
            title: becomingActive ? [...currentTitles, title] : without(currentTitles, title)
          }
        },
        activeThemes: becomingActive ? [...state.activeThemes, action.payload] : without(state.activeThemes, action.payload)
      };
    
    case `RESET_${THEME}`:
    case RESET_PARAMS: {
      let { themes } = state;
      return {
        ...state,
        searchState: {
          refinementList: {title: []}
        },
        themes: Object.keys(themes).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, themes[k], {isActive: false})
        }), {}),
        activeThemes: []
      }
    }
      
    default:
      return state;
  }
}
