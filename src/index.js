import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment-timezone';

import './index.css';
import App from './App';
import { fetchIndexes } from './js/actions/algolia-actions';
import store from './js/store';

moment.tz.setDefault('Europe/Paris');

store.dispatch(fetchIndexes());

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
