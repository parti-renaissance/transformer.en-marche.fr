import { SET_LANGUAGE } from '../actions/translate-actions';

export default function translateReducer(state = 'fr', action) {
  switch(action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return state;
  }
}
