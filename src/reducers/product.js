import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  id: null,
  name: '',
  description: '',
  imageUrl: '',
  items: [],
};

function product(state = initialState, action) {
  switch (action.type) {

    case types.PRODUCT_FETCH_SUCCESS:
      return assign({}, state, {
        id: action.product.id,
        name: action.product.name,
        description: action.product.description,
        imageUrl: action.product.imageUrl,
        items: action.product.items,
      });

    default:
      return state;
  }
}

export default product;
