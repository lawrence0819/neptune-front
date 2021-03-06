import { combineReducers } from 'redux';
import { SELECT_DRIVER } from '../constants/action-types';

function selected(state = {}, action) {
  switch (action.type) {
    case SELECT_DRIVER:
      return action.driver;
    default:
      return state;
  }
}

export default combineReducers({
  selected
})
