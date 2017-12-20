export const OPEN_AUTH = 'OPEN_AUTH';
export const CLOSE_AUTH = 'CLOSE_AUTH';
export const TOKEN = 'SET_TOKEN';

const apiPrefix = `${process.env.REACT_APP_API_HOST}/api`;
const redirectUri = 'http://localhost:3000'; //`${process.env.REACT_APP_REDIRECT_URI}`;

export const openAuth = () => ({
  type: OPEN_AUTH
});

export const closeAuth = () => ({
  type: CLOSE_AUTH
})

export const getToken = (token, code) => ({
  type: TOKEN,
  payload: fetch(`${apiPrefix}/auth?redirect_uri=${redirectUri}&code=${code}`).then(r => r.json())
})
