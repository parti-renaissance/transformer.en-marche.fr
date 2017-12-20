import algoliasearch from 'algoliasearch';

export const INDEXES = 'INDEXES';
export const PROGRESS = 'PROGRESS';

export function fetchIndexes() {
  const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
  const API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;
  
  const client = algoliasearch(APP_ID, API_KEY);
  
  const measuresClient = client.initIndex('Measure_dev');
  const profilesClient = client.initIndex('Profile_dev');
  const themesClient = client.initIndex('Theme_dev');

  return {
    type: INDEXES,
    payload: Promise.all([
      new Promise((res, rej) => measuresClient.search({
        hitsPerPage: 1000
      }, (err, {hits}) => err ? rej(err) : res(hits))),
      new Promise((res, rej) => profilesClient.search({}, (err, {hits}) => err ? rej(err) : res(hits))),
      new Promise((res, rej) => themesClient.search({}, (err, {hits}) => err ? rej(err) : res(hits))),
    ])
    .then(([measures, profiles, themes]) => ({measures, profiles, themes}))
  };
}

export const progression = () => ({
  type: `${PROGRESS}_FULFILLED`,
  payload: {
    'fait': {
      current: 35,
      total: 272
    },
    'en cours': {
      current: 12,
      total: 36
    },
    'a venir': {
      current: 556,
      total: 695
    }
  }
});
