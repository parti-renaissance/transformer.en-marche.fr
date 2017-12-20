export const VOTES = 'VOTES';
export const VOTE_UP = 'VOTE_UP';
export const VOTE_DOWN = 'VOTE_DOWN';
export const MY_VOTES = 'MY_VOTES';

const apiPrefix = `${process.env.REACT_APP_API_HOST}/api`;

export function getVoteCount() {
  return {
    type: VOTES,
    payload: fetch(`${apiPrefix}/items/votes/count`).then(r => r.json())
  }
}

export function voteUp(itemId, token) {
  return {
    type: VOTE_UP,
    payload: fetch(`${apiPrefix}/items/${itemId}/votes/up`, {headers: {
      Authorization: `Bearer ${token}`
    }, method: 'PUT'}).then(r => r.json())
  }
}

export function voteDown(itemId, token) {
  return {
    type: VOTE_DOWN,
    payload: fetch(`${apiPrefix}/items/${itemId}/votes/down`, {headers: {
      Authorization: `Bearer ${token}`
    }, method: 'PUT'}).then(r => r.json())
  }
}

export function myVotes(token) {
  return {
    type: MY_VOTES,
    payload: fetch(`${apiPrefix}/votes/users/me`, {headers: {
      Authorization: `Bearer ${token}`
    }}).then(r => r.json())
  }
}
