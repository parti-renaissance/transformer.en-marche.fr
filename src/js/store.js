import { applyMiddleware, createStore, compose } from 'redux';

import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createHistory from 'history/createBrowserHistory';

import { loadState } from './local-storage';
import reducer from './reducers';

const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

export const history = createHistory({ basename: rootPath });

const persistedState = loadState();
const middlewares = [
  promise(),
  thunk,
  routerMiddleware(history),
];

if (process.env.NODE_ENV === 'development')  {
  const { createLogger } = require('redux-logger');

  middlewares.push(createLogger());
}

export default createStore(reducer, persistedState, compose(applyMiddleware(...middlewares)));
