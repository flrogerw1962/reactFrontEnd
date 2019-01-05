import expect from 'expect';
import reducer from '../../src/reducers/products';
import * as types from '../../src/actions/actionTypes';

describe('products reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      list: [],
      items: [],
    });
  });

  it('should handle PRODUCTS_FETCH_SUCCESS', () => {
    const initialState = {
      list: [{
        id: 1,
        name: 'NoPrints',
      }],
      items: [],
    };
    const action = {
      type: types.PRODUCTS_FETCH_SUCCESS,
      products: [{
        id: 1,
        name: 'GoPrints',
      }],
      items: [{
        id: 1,
        productId: 1,
        name: 'Small GoPrint (3.5 x 4.25)',
        preview: {},
        disabled: false,
        sku: '703040',
        price: 100,
      }],
    };
    expect(
      reducer(initialState, action)
    ).toInclude({
      list: [{
        id: 1,
        name: 'GoPrints',
      }],
      items: [{
        id: 1,
        productId: 1,
        name: 'Small GoPrint (3.5 x 4.25)',
        preview: {},
        disabled: false,
        sku: '703040',
        price: 100,
      }],
    });
  });
});
