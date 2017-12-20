import { PROGRESS, VOTES } from '../actions/data-actions';

export function popularReducer(state = { items: [] }, action) {
  switch(action.type) {
    case `${VOTES}_PENDING`:
      return {...state, fetching: true};
    case `${VOTES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};
    case `${VOTES}_FULFILLED`:
      return {...state, fetching: false, fetched: true, items: action.payload};
    default:
      return state;
  }
}

export function progressReducer(state = { measures: {} }, action) {
  switch(action.type) {
    case `${PROGRESS}_PENDING`:
      return {...state, fetching: true};
    case `${PROGRESS}_REJECTED`:
      return {...state, fetching: false, error: action.payload};
    case `${PROGRESS}_FULFILLED`:
      return {...state, fetching: false, fetched: true, measures: action.payload};
    default:
      return state;
  }
}
