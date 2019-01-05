import { createStore, compose, applyMiddleware } from 'redux';
import DevTools from '../containers/DevTools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const defaultReducer = require('../reducers').default;

export default function configureStore(persistedState) {
  const store = createStore(
    rootReducer,
    persistedState,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = defaultReducer;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
