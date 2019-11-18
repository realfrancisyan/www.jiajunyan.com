import { combineReducers } from 'redux';
import notification from './reducers/notification';
import state from './reducers/state';

export default combineReducers({
  notification,
  state
});
