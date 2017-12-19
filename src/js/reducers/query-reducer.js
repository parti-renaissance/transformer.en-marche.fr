import { DO_QUERY } from '../actions/search-actions';

export default function queryReducer(state = {
  searchState: {
  }
}, action) {

  switch(action.type) {
    case DO_QUERY:
      if (action.query) {
        return {
          ...state,
          searchState: {
            query: action.query
          }
        }
      } else {
        return {
          ...state,
          searchState: {}
        }
      }
      
    default:
      return state;
  }
}
