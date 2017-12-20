import { INDEXES } from '../actions/data-actions';
import { VOTES } from '../actions/vote-actions';

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
    case `${INDEXES}_FULFILLED`:
      let { measures } = action.payload;
      const newState = {
        ...state,
        fetching: false,
        fetched: true,
        items: measures.map(measure => measure.objectID),
      };
      measures.forEach(measure => newState.measures[measure.objectID] = measure);
      return newState;
    default:
      return state;
  }
}
