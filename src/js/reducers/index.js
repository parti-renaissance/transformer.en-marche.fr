import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import measures from './measures-reducer';
import profiles from './profiles-reducer';
import themes from './themes-reducer';
import query from './query-reducer';
import { popularReducer, statusReducer } from './dashboard-reducer';
import locale from './translate-reducer';
import auth from './auth-reducer';
import majorOnly from './major-reducer.js';
import aboutModal from './about-reducer.js';

export default combineReducers({
  measures,
  themes,
  profiles,
  query,
  routing,
  locale,
  auth,
  popular: popularReducer,
  status: statusReducer,
  majorOnly,
  aboutModal
});
