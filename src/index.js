import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment-timezone';
import qs from 'qs';

import './index.css';
import App from './App';
import { fetchIndexes } from './js/actions/data-actions';
import { getToken } from './js/actions/auth-actions';
import { myVotes } from './js/actions/vote-actions';
import store from './js/store';

moment.tz.setDefault('Europe/Paris');

store.dispatch(fetchIndexes());

let queryParams = qs.parse(window.location.search.slice(1));

if (queryParams.code) {
  store.dispatch(getToken(queryParams.code))
    .then(({ value }) => store.dispatch(myVotes(value.access_token)));
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
