import { SET_PROFILE, RESET_PARAMS, PROFILE } from '../actions/search-actions';
import { INDEXES } from '../actions/data-actions';

export default function profilesReducer(state = {
  items: [],
  profiles: {},
  profilesByTitle: {},
  activeProfile: null,
  searchState: {
    menu: {}
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
      let { profiles } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: profiles.map(profile => profile.id),
        profilesByTitle: profiles.reduce((s, p) => ({
          ...s,
          [p.title]: Object.assign({}, state.profiles[p.id], p)
        }), {}),
        profiles: profiles.reduce((s, p) => ({
          ...s,
          [p.id]: Object.assign({}, state.profiles[p.id], p)
        }), {})
      };
      
    case SET_PROFILE: {
      let { profiles } = state;
      let { payload:profile } = action;
      const newState = {
        ...state,
        searchState: {
          menu: {}
        },
        profiles: Object.keys(profiles).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, profiles[k], {isActive: false})
        }), {}),
        activeProfile: null
      };
      
      if (profiles[profile]) {
        newState.activeProfile = profile;
        newState.profiles[profile].isActive = true;
        newState.searchState = {
          menu: {
            'measures.profiles.title': profiles[profile].title
          }
        };
      } 
      return newState;
    }
    
    case `RESET_${PROFILE}`:
    case RESET_PARAMS: {
      let { profiles } = state;
      return {
        ...state,
        searchState: {
          menu: {}
        },
        profiles: Object.keys(profiles).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, profiles[k], {isActive: false})
        }), {}),
        activeProfile: null
      };
    }

    default:
      return state;
  }
}
