import expect from 'expect';
import reducer from '../../src/reducers/cart';
// import * as types from '../../src/actions/actionTypes';

describe('cart reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      listProducts: [],
      quantity: 0,
      totalPrice: 0,
    });
  });
});
