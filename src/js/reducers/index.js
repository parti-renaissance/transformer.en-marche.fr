import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import measures from './measures-reducer';
import profiles from './profiles-reducer';
import themes from './themes-reducer';
import query from './query-reducer';

export default combineReducers({
  measures,
  themes,
  profiles,
  query,
  routing
});
