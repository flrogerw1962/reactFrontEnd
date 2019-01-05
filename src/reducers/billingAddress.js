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

function billingAddress(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_BILLING_ADDRESS:
      return assign({}, state, action.map);
    default:
      return state;
  }
}

export default billingAddress;
