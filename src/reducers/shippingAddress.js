import * as types from '../actions/actionTypes';
import { assign } from 'lodash';
const initialState = {
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
};

function shippingAddress(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_ADDRESSES_SUCCESS:
      return assign(action.addresses[0] || {}, {
        name: state.name,
      });
    case types.FETCH_USER_SUCCESS:
      return assign({}, state, {
        name: action.user.name,
      });
    case types.UPDATE_SHIPPING_ADDRESS:
      return assign({}, state, action.map);
    default:
      return state;
  }
}

export default shippingAddress;
