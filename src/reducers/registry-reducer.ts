import * as _ from 'lodash';
import { combineReducers } from 'redux';
import ASYNC_STATUS from '../constants/async-status';
import { SEARCH_REGISTRY_IMAGES } from '../constants/action-types';
import { AsyncAction } from '../constants/interfaces';

function search(state = {}, action: AsyncAction) {
  if (action.type === SEARCH_REGISTRY_IMAGES) {
    const result = action.result;
    switch (action.asyncStatus) {
      case ASYNC_STATUS.COMPLETED:
        let images:any = _.assign({}, state);
        if (images.query !== result.query) {
          images = result;
        } else {
          images = _.merge(images, result, (a, b) => {
            if (_.isArray(a)) {
              return a.concat(b);
            } else {
              return b;
            }
          });
        }
        return images;
    }
  }
  return state;
}

function createOperatingReducer(actionType: string) {
  return (state = false, action: AsyncAction) => {
    if (actionType === action.type) {
      switch (action.asyncStatus) {
        case ASYNC_STATUS.START:
          return true;
        case ASYNC_STATUS.COMPLETED:
          return false;
      }
    }
    return state;
  }
}

export default combineReducers({
  search,
  operating: combineReducers({
    search: createOperatingReducer(SEARCH_REGISTRY_IMAGES)
  })
})
