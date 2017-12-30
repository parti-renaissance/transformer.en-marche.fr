import algoliasearch from 'algoliasearch';

export const INDEXES = 'INDEXES';
export const PROGRESS = 'PROGRESS';

export function fetchIndexes() {
  const APP_ID        = process.env.REACT_APP_ALGOLIA_APP_ID;
  const API_KEY       = process.env.REACT_APP_ALGOLIA_API_KEY;
  const MEASURE_INDEX = process.env.REACT_APP_ALGOLIA_MEASURE_INDEX;
  const THEME_INDEX   = process.env.REACT_APP_ALGOLIA_THEME_INDEX;
  const PROFILE_INDEX = process.env.REACT_APP_ALGOLIA_PROFILE_INDEX;
  
  const client = algoliasearch(APP_ID, API_KEY);
  
  const measuresClient = client.initIndex(MEASURE_INDEX);
  const profilesClient = client.initIndex(PROFILE_INDEX);
  const themesClient   = client.initIndex(THEME_INDEX);

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
