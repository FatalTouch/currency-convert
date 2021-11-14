/**
 * Our redux store module
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reduxThunk from 'redux-thunk';

import reducers from './reducers/reducers';


// List of middlewares
const middleWares = [reduxThunk];

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['form', 'modal', 'media', 'router']
};

const persistedReducer = persistReducer(persistConfig, reducers);

// Compose enhancers to enable redux dev tools and fallback to compose in case they aren't available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(...middleWares))
);
export default store;
export const persistor = persistStore(store);
export const { dispatch } = store;
