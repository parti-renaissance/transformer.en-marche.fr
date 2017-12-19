import {
  FETCH_POPULAR_PENDING,
  FETCH_POPULAR_REJECTED,
  FETCH_POPULAR_FULFILLED,
  FETCH_PROGRESS_PENDING,
  FETCH_PROGRESS_REJECTED,
  FETCH_PROGRESS_FULFILLED,
} from '../actions/dashboard-actions';

export function popularReducer(state = { items: [] }, action) {
  switch(action.type) {
    case FETCH_POPULAR_PENDING:
      return {...state, fetching: true};
    case FETCH_POPULAR_REJECTED:
      return {...state, fetching: false, error: action.payload};
    case FETCH_POPULAR_FULFILLED:
      return {...state, fetching: false, fetched: true, items: action.payload};
    default:
      return state;
  }
}

export function progressReducer(state = { measures: {} }, action) {
  switch(action.type) {
    case FETCH_PROGRESS_PENDING:
      return {...state, fetching: true};
    case FETCH_PROGRESS_REJECTED:
      return {...state, fetching: false, error: action.payload};
    case FETCH_PROGRESS_FULFILLED:
      return {...state, fetching: false, fetched: true, measures: action.payload};
    default:
      return state;
  }
}
