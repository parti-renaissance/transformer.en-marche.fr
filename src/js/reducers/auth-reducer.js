import {
  OPEN_AUTH,
  CLOSE_AUTH,
  TOKEN
 } from '../actions/auth-actions';

export default function authReducer(state = { token: '', openModal: false }, action) {
  switch(action.type) {
    case OPEN_AUTH:
      return {...state, openModal: true};

    case CLOSE_AUTH:
      return {...state, openModal: false};

    case `${TOKEN}_PENDING`:
      return {...state, fetchingToken: true};
    case `${TOKEN}_REJECTED`:
      return {...state, fetchingToken: false, error: action.payload};
    case `${TOKEN}_FULFILLED`:
      return {
        ...state,
        fetchingToken: false,
        fetchedToken: true,
        token: action.payload.access_token
      };

    default:
      return state;
      
  }
}
