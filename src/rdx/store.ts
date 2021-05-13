import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore} from 'redux-persist';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'rdx/rootReducer';
import rootSagas from 'rdx/rootSagas';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
  let enhancer;
  if (__DEV__) {
    const createFlipperDebugger = require('redux-flipper').default;
    enhancer = composeWithDevTools(
      applyMiddleware(sagaMiddleware, createFlipperDebugger()),
    );
  } else {
    enhancer = compose(applyMiddleware(sagaMiddleware));
  }
  return createStore(rootReducer, enhancer);
}

export const store = configureStore();
export const persistor = persistStore(store);

sagaMiddleware.run(rootSagas);
