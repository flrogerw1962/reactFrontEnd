import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  list: [],
  items: [],
};

function products(state = initialState, action) {
  switch (action.type) {
    case types.PRODUCTS_FETCH_SUCCESS:
      return assign({}, state, {
        list: action.products,
        items: action.items,
      });
    default:
      return state;
  }
}

export default products;
