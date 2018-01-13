import without from 'lodash/without';

import { TOGGLE_THEME_FACET, RESET_PARAMS, THEME } from '../actions/search-actions';
import { INDEXES } from '../actions/data-actions';

export default function themesReducer(state = {
  items: [],
  activeThemes: [],
  themes: {},
  searchState: [],
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
        items: themes.map(theme => theme.id),
        themes: themes.reduce((s, t) => ({
          ...s,
          [t.id]: Object.assign({}, state.themes[t.id], t)
        }), {}),
        activeThemes: []
      };
      
    case TOGGLE_THEME_FACET:
      let currentThemes = state.searchState;
      let { id, isActive } = state.themes[action.payload];
      let becomingActive = !isActive;
      
      return {
        ...state,
        themes: Object.assign({}, state.themes, {
          [action.payload]: {
            ...state.themes[action.payload],
            isActive: becomingActive
          }
        }),
        searchState: becomingActive ? [...currentThemes, id] : without(currentThemes, id),
        activeThemes: becomingActive ? [...state.activeThemes, action.payload] : without(state.activeThemes, action.payload)
      };
    
    case `RESET_${THEME}`:
    case RESET_PARAMS: {
      let { themes } = state;
      return {
        ...state,
        searchState: [],
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
