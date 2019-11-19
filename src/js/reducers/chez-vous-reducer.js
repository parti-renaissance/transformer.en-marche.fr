import {CLOSE_CHEZ_VOUS } from '../actions/chez-vous-actions';

export default function chezVousReducer(state = true, action) {
  if (action.type === CLOSE_CHEZ_VOUS) {
    return false;
  }

  return state;
}
