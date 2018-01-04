import {
  OPEN_AUTH,
  CLOSE_AUTH,
  SET_TOKEN,
  CLEAR_TOKEN
 } from '../actions/auth-actions';
 
import { VOTES, MY_VOTES, VOTE_UP, VOTE_DOWN } from '../actions/vote-actions';

export default function authReducer(state = { token: '', openModal: false, fetchedToken: false }, action) {
  switch(action.type) {
    case OPEN_AUTH:
      return {...state, openModal: true};

    case CLOSE_AUTH:
      return {...state, openModal: false};

    case `${SET_TOKEN}_PENDING`:
      return {...state, fetchingToken: true};
    case `${SET_TOKEN}_REJECTED`:
      return {
        ...state,
        token: '',
        fetchedToken: false,
        fetchingToken: false,
        error: action.payload,
      };
    case `${SET_TOKEN}_FULFILLED`:
      return {
        ...state,
        fetchingToken: false,
        fetchedToken: true,
        token: action.payload.access_token
      };
    
    case `${VOTES}_REJECTED`:
    case `${MY_VOTES}_REJECTED`:
    case `${VOTE_UP}_REJECTED`:
    case `${VOTE_DOWN}_REJECTED`:
    case CLEAR_TOKEN:
      return {...state, token: '', fetchedToken: false};

    default:
      return state;
      
  }
}
