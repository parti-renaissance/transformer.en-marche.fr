import {
  FETCH_INDEXES_PENDING,
  FETCH_INDEXES_REJECTED,
  FETCH_INDEXES_FULFILLED,
} from '../actions/algolia-actions';

export default function measuresReducer(state = {
  items: [],
  measures: {},
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
