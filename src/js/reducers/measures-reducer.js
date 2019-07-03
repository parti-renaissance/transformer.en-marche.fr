import { INDEXES } from '../actions/data-actions';
import { VOTES, MY_VOTES, VOTE_UP, VOTE_DOWN } from '../actions/vote-actions';
import { CLEAR_TOKEN } from '../actions/auth-actions';
import map from 'lodash/map';
import arrayFind from 'lodash/find';


function findManifesto(manifestos, id) {
  const {
    titles = {},
    descriptions = {},
    slugs = {},
  } = arrayFind(manifestos, ['id', id]) || {};

  return { titles, descriptions, slugs, id };
}

export default function measuresReducer(state = {
  items: [],
  measures: {},
  fetching: false,
  fetched: false,
  error: null
}, action) {

  switch(action.type) {
    case `${INDEXES}_PENDING`:
      return {...state, fetching: true};

    case `${INDEXES}_REJECTED`:
      return {...state, fetching: false, error: action.payload};

    case `${INDEXES}_FULFILLED`: {
      let { measures, manifestos } = action.payload;
      return {
        ...state,
        fetching: false,
        fetched: true,
        items: map(measures, 'id'),
        measures: measures.reduce((s, m) => ({
          ...s,
          [m.id]: Object.assign({
            manifesto: findManifesto(manifestos, m.manifestoId),
          }, m, state.measures[m.id])
        }), {})
      };
    }

    case `${VOTES}_FULFILLED`: {
      let { payload:votes } = action;
      votes = votes.filter(({itemId}) => typeof itemId === 'number' && state.measures[itemId]);
      return {
        ...state,
        measures: {
          ...state.measures,
          ...votes.reduce((s, {itemId, count}) => ({
            ...s,
            [itemId]: Object.assign({}, state.measures[itemId], {count})
          }), {})
        }
      };
    }

    case `${MY_VOTES}_FULFILLED`: {
      let { payload:votes } = action;
      return {
        ...state,
        measures: {
          ...state.measures,
          ...votes.reduce((s, {itemId:id}) => ({
            ...s,
            [id]: Object.assign({}, state.measures[id], {isActive:true})
          }), {})
        }
      };
    }

    case VOTE_UP:
    case VOTE_DOWN:
    case `${VOTE_DOWN}_PENDING`:
    case `${VOTE_UP}_PENDING`: {
      let { payload:id, type } = action;
      let { measures } = state;
      let isUp = type.match(VOTE_UP) ? true : false;
      let isPending = type.match('_PENDING') ? true : false;
      return {
        ...state,
        measures: {
          ...measures,
          [id]: Object.assign({}, measures[id], {
            isActive: isUp,
            count: isUp ? measures[id].count + 1 : measures[id].count - 1,
            isPending
          })
        }
      };
    }

    case `${VOTE_UP}_FULFILLED`:
    case `${VOTE_DOWN}_FULFILLED`: {
      let { type, payload: { itemId:id } } = action;
      let { measures } = state;
      let isUp = type === `${VOTE_UP}_FULFILLED`;
      return {
        ...state,
        measures: {
          ...measures,
          [id]: Object.assign({}, measures[id], {
            isActive: isUp,
            isPending: false
          })
        }
      }
    }

    case `${VOTE_UP}_REJECTED`:
    case `${VOTE_DOWN}_REJECTED`: {
      let { measures } = state;
      return {
        ...state,
        measures: Object.keys(measures).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, measures[k], {isPending: false})
        }), {})
      }
    }

    case CLEAR_TOKEN:
      let { measures } = state;
      return {
        ...state,
        measures: Object.keys(measures).reduce((s, k) => ({
          ...s,
          [k]: Object.assign({}, measures[k], {isActive: false})
        }), {})
      }

    default:
      return state;
  }
}
