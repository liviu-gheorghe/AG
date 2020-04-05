import {combineReducers} from 'redux';

// root reducer
export function rootReducer(state=0,action)
{
    switch(action.type)
    {
        case "INCREMENT":
            return state+1;
        case "DECREMENT":
            return state-1;
        case "ADD":
            return state+action.amount;
        case "SUBSTRACT":
            return state-action.amount;
        default:
            return state;
    }
}