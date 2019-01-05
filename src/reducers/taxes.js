import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  taxList: [],
};

function taxes(state = initialState, action) {
  switch (action.type) {
    case types.TAXES_FETCH_SUCCESS:
      return assign({}, state, {
        taxList: action.taxList,
      });
    default:
      return state;
  }
}

export default taxes;
