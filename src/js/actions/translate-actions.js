import { push } from 'react-router-redux'

export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setLanguage = language => ({
  type: SET_LANGUAGE,
  payload: language
});

export const setLocale = (locale, {pathname, search}) => dispatch => {
  let [, path] = pathname.slice(1).split('/');
  if (path && search) {
    path += search;
  }
  dispatch(push(`/${locale}${path ? `/${path}` : ''}`));
  dispatch(setLanguage(locale));
}
