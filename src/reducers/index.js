import { combineReducers } from 'redux';
import invitesReducer from './invites_reducer';

const rootReducer = combineReducers({
  invites: invitesReducer
});

export default rootReducer;
