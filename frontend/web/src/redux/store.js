import {createStore,combineReducers} from 'redux';
import {rootReducer} from './reducers';



const inital_state = 197;
export const store = createStore(rootReducer,inital_state);