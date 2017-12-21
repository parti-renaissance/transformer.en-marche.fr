import { applyMiddleware, createStore, compose } from 'redux';

import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createHistory from 'history/createBrowserHistory';

import { loadState } from './local-storage';
import reducer from './reducers';

export const history = createHistory();

const persistedState = loadState();
const middlewares = [
  promise(),
  thunk,
  routerMiddleware(history),
];

if (process.env.NODE_ENV === 'development')  {
  const { createLogger } = require(`redux-logger`);

  middlewares.push(createLogger());
}

console.log(persistedState);
export default createStore(reducer, persistedState, compose(applyMiddleware(...middlewares)));
