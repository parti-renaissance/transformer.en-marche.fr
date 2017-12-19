const voteAPI = `${process.env.REACT_APP_API_HOST}/api/items/votes`;

export const FETCH_POPULAR_PENDING = 'FETCH_POPULAR_PENDING';
export const FETCH_POPULAR_FULFILLED = 'FETCH_POPULAR_FULFILLED';
export const FETCH_POPULAR_REJECTED = 'FETCH_POPULAR_REJECTED';

export const FETCH_PROGRESS_PENDING = 'FETCH_PROGRESS_PENDING';
export const FETCH_PROGRESS_FULFILLED = 'FETCH_PROGRESS_FULFILLED';
export const FETCH_PROGRESS_REJECTED = 'FETCH_PROGRESS_REJECTED';

export function progression() {
  return {
    type: FETCH_PROGRESS_FULFILLED,
    payload: {
      'fait': {
        current: 35,
        total: 272
      },
      'en cours': {
        current: 12,
        total: 36
      },
      'a venir': {
        current: 556,
        total: 695
      }
    }
  };
}

export function popularMeasures() {
  return dispatch => {
    dispatch({type: FETCH_POPULAR_PENDING});
    
    fetch(`${voteAPI}/count`).then(r => r.json())
      .then(payload => dispatch({type: FETCH_POPULAR_FULFILLED, payload}))
      .catch(payload => dispatch({type: FETCH_POPULAR_REJECTED, payload}));
  }
}
