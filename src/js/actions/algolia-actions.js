import algoliasearch from 'algoliasearch';

export const FETCH_INDEXES_PENDING = 'FETCH_INDEXES_PENDING';
export const FETCH_INDEXES_FULFILLED = 'FETCH_INDEXES_FULFILLED';
export const FETCH_INDEXES_REJECTED = 'FETCH_INDEXES_REJECTED';

export function fetchIndexes() {
  const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
  const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
  
  const client = algoliasearch(APP_ID, API_KEY);
  
  const measuresClient = client.initIndex('Measure_dev');
  const profilesClient = client.initIndex('Profile_dev');
  const themesClient = client.initIndex('Theme_dev');

  return dispatch => {
    dispatch({type: FETCH_INDEXES_PENDING});

    Promise.all([
      new Promise((resolve, reject) => measuresClient.search({
        hitsPerPage: 1000
      }, (err, content) => err ? reject(err) : resolve(content.hits))),
      new Promise((resolve, reject) => profilesClient.search({}, (err, content) => err ? reject(err) : resolve(content.hits))),
      new Promise((resolve, reject) => themesClient.search({}, (err, content) => err ? reject(err) : resolve(content.hits))),
    ])
    .then(([measures, profiles, themes]) => dispatch({type: FETCH_INDEXES_FULFILLED, measures, profiles, themes}))
    .catch(payload => dispatch({type: FETCH_INDEXES_REJECTED, payload}))
  }
}
