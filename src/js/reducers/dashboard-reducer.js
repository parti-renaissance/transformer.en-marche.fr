import { VOTES } from '../actions/vote-actions';
import { INDEXES } from '../actions/data-actions';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';

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
        items: sortBy(action.payload, 'count').reverse().slice(0, 5)
      };
    default:
      return state;
  }
}

export function statusReducer(state = { measures: {} }, action) {
  switch(action.type) {
    case `${INDEXES}_PENDING`:
      return {...state, fetching: true};
    case `${INDEXES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};
    case `${INDEXES}_FULFILLED`:
      let { measures } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        measures: countBy(filter(measures, 'global'), 'status'),
        total: measures.length
      };
    default:
      return state;
  }
}
