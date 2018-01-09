import { CLOSE_ABOUT, OPEN_ABOUT } from '../actions/about-actions';

export default function aboutReducer(state = false, action) {
  switch(action.type) {
    case CLOSE_ABOUT:
      return false;
    case OPEN_ABOUT:
      return true;
    default:
      return state;
  }
}
