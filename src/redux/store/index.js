import { createStore, compose, applyMiddleware } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunk from 'redux-thunk';
import userReducer from '../reducers/user'
import chatReducer from '../reducers/chat'
import editorReducer from '../reducers/editor'

const __DEV__ = process.env.NODE_ENV === 'development';

let composeEnhancers = compose;

if (__DEV__) {
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
}

const config = {
  key: 'root',
  transforms: [],
  blacklist: [''],
  whitelist: ['userData', 'editorData', 'chat'],
  storage
};

export const makeRootReducer = (asyncReducers) => {
  return persistCombineReducers(config, {
    userData: userReducer,
    chat: chatReducer,
    editorData: editorReducer,
    ...asyncReducers
  });
};

const store = createStore(makeRootReducer(), window.__INITIAL_STATE__, composeEnhancers(applyMiddleware(thunk)));
store.asyncReducers = {};
const persistor = persistStore(store);

export {
  store,
  persistor
};
