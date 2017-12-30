export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null)  {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch(e) {
    return undefined;
  }
};

export const saveState = state =>  {
  try {
    let { auth, locale, query } = state;
    const serializedState = JSON.stringify({auth, locale, query});
    localStorage.setItem('state', serializedState);
  } catch(e) {
    // ignore
  }
};
