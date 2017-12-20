import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import measures from './measures-reducer';
import profiles from './profiles-reducer';
import themes from './themes-reducer';
import query from './query-reducer';
import { popularReducer, progressReducer } from './dashboard-reducer';
import locale from './translate-reducer';
import auth from './auth-reducer';

export default combineReducers({
  measures,
  themes,
  profiles,
  query,
  routing,
  locale,
  auth,
  popular: popularReducer,
  progress: progressReducer,
});
