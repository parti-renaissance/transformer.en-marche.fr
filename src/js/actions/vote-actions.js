import { openAuth } from './auth-actions';

export const VOTES = 'VOTES';
export const VOTE_UP = 'VOTE_UP';
export const VOTE_DOWN = 'VOTE_DOWN';
export const MY_VOTES = 'MY_VOTES';

const apiPrefix = `${process.env.REACT_APP_API_HOST}/api`;

export const getVoteCount = () => ({
  type: VOTES,
  payload: fetch(`${apiPrefix}/items/votes/count`).then(r => r.json())
});

export const voteUp = (itemId, token) => {
  return dispatch => dispatch({
    type: VOTE_UP,
    payload: {
      promise: fetch(`${apiPrefix}/items/${itemId}/votes/up`, {headers: {
        Authorization: `Bearer ${token}`
      }, method: 'PUT'}).then(r => r.json()),
      data: itemId
    }
  }).catch(() => {
    dispatch({type: VOTE_DOWN, payload: itemId}); // undo the vote
    dispatch(openAuth());
  });
}

export const voteDown = (itemId, token) => {
  return dispatch => dispatch({
    type: VOTE_DOWN,
    payload: {
      promise: fetch(`${apiPrefix}/items/${itemId}/votes/down`, {headers: {
        Authorization: `Bearer ${token}`
      }, method: 'PUT'}).then(r => r.json()),
      data: itemId
    }
  }).catch(() => {
    dispatch({type: VOTE_UP, payload: itemId}); // undo the vote
    dispatch(openAuth());
  });
}

export const myVotes = (token, promptOnFail = true) => {
  return dispatch => dispatch({
    type: MY_VOTES,
    payload: fetch(`${apiPrefix}/votes/users/me`, {headers: {
      Authorization: `Bearer ${token}`
    }}).then(r => r.json())
  }).catch(() => {
    if (promptOnFail) {
      dispatch(openAuth());
    }
  });
}
