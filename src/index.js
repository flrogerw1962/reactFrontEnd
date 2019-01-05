import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import { loadState, saveState } from './store/localStorage';

const persistedState = loadState();
const store = configureStore(persistedState);
const history = syncHistoryWithStore(browserHistory, store);

store.subscribe(() => {
  saveState(store.getState());
});

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
