import { SET_LANGUAGE } from '../actions/translate-actions';

export default function translateReducer(_state = 'fr', action) {
  switch(action.type) {
    case SET_LANGUAGE:
      return 'fr';
    default:
      return 'fr';
  }
}
