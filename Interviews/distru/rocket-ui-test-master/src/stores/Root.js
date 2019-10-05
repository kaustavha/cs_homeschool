import { createStore, combineReducers } from 'redux';
import launchCollection from './LaunchCollectionReducer';

const rootReducer = combineReducers({
  launchCollection
});

const store = createStore(rootReducer);

export default store;
