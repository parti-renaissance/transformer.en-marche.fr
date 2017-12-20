import { VOTES } from '../actions/vote-actions';
import { PROGRESS } from '../actions/data-actions';
import sortBy from 'lodash/sortBy';

export function popularReducer(state = { items: [] }, action) {
  switch(action.type) {
    case `${VOTES}_PENDING`:
      return {...state, fetching: true};
    case `${VOTES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};
    case `${VOTES}_FULFILLED`:
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: sortBy(action.payload, 'count')
      };
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
      return {
        ...state,
        fetching: false,
        fetched: true,
        measures: action.payload
      };
    default:
      return state;
  }
}
