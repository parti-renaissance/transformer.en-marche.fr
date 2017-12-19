import { SET_PROFILE } from '../actions/search-actions';
import {
  FETCH_INDEXES_PENDING,
  FETCH_INDEXES_REJECTED,
  FETCH_INDEXES_FULFILLED,
} from '../actions/load-data';

export default function profilesReducer(state = {
  items: [],
  profiles: {},
  searchState: {
    menu: {}
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
    case FETCH_INDEXES_FULFILLED: {
      let { profiles } = action;
      const newState = {
        ...state,
        fetching: false,
        fetched: true,
        items: profiles.map(profile => profile.objectID),
      };
      profiles.forEach(profile => newState.profiles[profile.objectID] = profile);
      return newState;
      
    }
    case SET_PROFILE: {
      console.log('set profile')
      let { profiles } = state;
      let { profile } = action;
      const newState = {
        ...state,
        searchState: {
          menu: {}
        }
      };
      
      Object.keys(newState.profiles).forEach(key => newState.profiles[key].isActive = false);
      
      if (profiles[profile]) {
        newState.profiles[profile].isActive = true;
        newState.searchState = {
          menu: {
            'measures.profiles.title': profiles[profile].title
          }
        };
      } 
      return newState;
    }

    default:
      return state;
  }
}
