import { INDEXES } from '../actions/data-actions';
import { VOTES, MY_VOTES, VOTE_UP, VOTE_DOWN } from '../actions/vote-actions';

export default function measuresReducer(state = {
  items: [],
  measures: {},
  fetching: false,
  fetched: false,
  error: null  
}, action) {
  
  switch(action.type) {
    case `${INDEXES}_PENDING`:
      return {...state, fetching: true};

    case `${INDEXES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};

    case `${INDEXES}_FULFILLED`: {
      let { measures } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: measures.map(m => m.objectID),
        measures: measures.reduce((s, m) => ({
          ...s,
          [m.objectID]: Object.assign({}, m, state.measures[m.objectID])
        }), {})
      };
    }
    
    case `${VOTES}_FULFILLED`: {
      let { payload:votes } = action;
      return {
        ...state,
        measures: {
          ...state.measures,
          ...votes.reduce((s, {itemId, count}) => ({
            ...s,
            [itemId]: Object.assign({}, state.measures[itemId], {count})
          }), {})
        }
      };
    }
    
    case `${MY_VOTES}_FULFILLED`: {
      let { payload:votes } = action;
      return {
        ...state,
        measures: {
          ...state.measures,
          ...votes.reduce((s, {itemId:id}) => ({
            ...s,
            [id]: Object.assign({}, state.measures[id], {isActive:true})
          }), {})
        }
      };
    }
    }
    
    case `${VOTE_UP}_PENDING`:
      const newState = { ...state };
      newState.measures[action.payload].isActive = true;
      return newState;

    default:
      return state;
  }
}
