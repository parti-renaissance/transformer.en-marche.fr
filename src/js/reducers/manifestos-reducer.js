import without from 'lodash/without';

import { TOGGLE_MANIFESTO_FACET, RESET_PARAMS, MANIFESTO } from '../actions/search-actions';
import { INDEXES } from '../actions/data-actions';

export default function manifestosReducer(state = {
  items: [],
  activeManifestos: [],
  manifestos: {},
  searchState: [],
  fetching: false,
  fetched: false,
  error: null
}, action) {

  switch(action.type) {
    case `${INDEXES}_PENDING`:
      return {...state, fetching: true};

    case `${INDEXES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};

    case `${INDEXES}_FULFILLED`:
      let { manifestos } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: manifestos.map(manifesto => manifesto.id),
        manifestos: manifestos.reduce((s, m) => ({
          ...s,
          [m.id]: Object.assign({}, state.manifestos[m.id], m)
        }), {}),
        activeManifestos: []
      };

    case TOGGLE_MANIFESTO_FACET:
      let currentManifestos = state.searchState;
      let { id, isActive } = state.manifestos[action.payload];
      let becomingActive = !isActive;

      return {
        ...state,
        themes: Object.assign({}, state.manifestos, {
          [action.payload]: {
            ...state.manifestos[action.payload],
            isActive: becomingActive
          }
        }),
        searchState: becomingActive ? [...currentManifestos, id] : without(currentManifestos, id),
        activeManifestos: becomingActive ? [...state.activeManifestos, action.payload] : without(state.activeManifestos, action.payload)
      };

    case `RESET_${MANIFESTO}`:
    case RESET_PARAMS: {
      let { manifestos } = state;
      return {
        ...state,
        searchState: [],
        manifestos: Object.keys(manifestos).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, manifestos[k], {isActive: false})
        }), {}),
        activeManifestos: []
      }
    }

    default:
      return state;
  }
}
