import { SELECT_DRIVER } from '../constants/action-types';
import { Driver } from '../constants/drivers';

export const select = (driver: Driver) => (dispatch) => dispatch({
  type: SELECT_DRIVER,
  driver: driver
});
