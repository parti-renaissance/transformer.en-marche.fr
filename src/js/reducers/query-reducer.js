import { DO_QUERY, RESET_PARAMS, QUERY } from '../actions/search-actions';

export default function queryReducer(state = {
  searchState: {}
}, action) {

  switch(action.type) {
    case DO_QUERY:
      if (action.payload) {
        return {
          ...state,
          searchState: {
            query: action.payload
          }
        }
      } else {
        return {
          ...state,
          searchState: {}
        }
      }
      
    case `RESET_${QUERY}`:
    case RESET_PARAMS:
      return {
        ...state,
        searchState: {}
      };
  
    default:
      return state;
  }
}
