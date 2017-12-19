import {
  FETCH_INDEXES_PENDING,
  FETCH_INDEXES_REJECTED,
  FETCH_INDEXES_FULFILLED,
} from '../actions/load-data';

export default function measuresReducer(state = {
  items: [],
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
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: action.measures,
      };
    default:
      return state;
  }
}
