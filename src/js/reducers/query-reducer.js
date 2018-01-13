import { DO_QUERY, RESET_PARAMS, QUERY } from '../actions/search-actions';

export default function queryReducer(state = '', action) {

  switch(action.type) {
    case DO_QUERY:
      if (action.payload) {
        return action.payload;
      } else {
        return state;
      }
      
    case `RESET_${QUERY}`:
    case RESET_PARAMS:
      return '';
  
    default:
      return state;
  }
}
