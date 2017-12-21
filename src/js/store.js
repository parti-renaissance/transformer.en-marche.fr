import { applyMiddleware, createStore } from 'redux';

import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createHistory from 'history/createBrowserHistory';

import { loadState } from './local-storage';
import reducer from './reducers';

export const history = createHistory();

const persistedState = loadState();
const middleware = applyMiddleware(
  promise(),
  thunk,
  routerMiddleware(history),
  createLogger(),
);

export default createStore(reducer, persistedState, middleware);
