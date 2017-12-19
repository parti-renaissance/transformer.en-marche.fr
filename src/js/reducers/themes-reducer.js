import without from 'lodash/without';

import { TOGGLE_THEME_FACET } from '../actions/search-actions';
import {
  FETCH_INDEXES_PENDING,
  FETCH_INDEXES_REJECTED,
  FETCH_INDEXES_FULFILLED,
} from '../actions/load-data';

export default function themesReducer(state = {
  items: [],
  themes: {},
  searchState: {
    refinementList: {title: []}
  },
  fetching: false,
  fetched: false,
  error: null  
}, action) {
  
  switch(action.type) {
    case FETCH_INDEXES_PENDING:
      return {...state, fetching: true};
      
    case FETCH_INDEXES_REJECTED:
      return {...state, fetching: false, error: action.payload};
      
    case FETCH_INDEXES_FULFILLED:
      const newState = {
        ...state,
        fetching: false,
        fetched: true,
        items: action.themes.map(theme => theme.objectID),
      };
      action.themes.forEach(theme => newState.themes[theme.objectID] = theme);
      return newState;
      
    case TOGGLE_THEME_FACET:
      let currentTitles = state.searchState.refinementList.title;
      let { title, isActive } = state.themes[action.theme];
      let becomingActive = !isActive;
      
      return {
        ...state,
        themes: Object.assign({}, state.themes, {
          [action.theme]: {
            ...state.themes[action.theme],
            isActive: becomingActive
          }
        }),
        searchState: {
          refinementList: {
            title: becomingActive ? [...currentTitles, title] : without(currentTitles, title)
          }
        }
      };
      
    default:
      return state;
  }
}
