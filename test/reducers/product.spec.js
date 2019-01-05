import expect from 'expect';
import reducer from '../../src/reducers/product';
import * as types from '../../src/actions/actionTypes';

describe('product reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      id: null,
      name: '',
      description: '',
      imageUrl: '',
      items: [],
    });
  });

  it('should handle PRODUCT_FETCH_SUCCESS', () => {
    const initialState = {
      id: 1,
      name: 'NoPrints',
      description: 'Nothing here to see.',
      imageUrl: 'http://example.com/img0.jpg',
      items: [],
    };
    const action = {
      type: types.PRODUCT_FETCH_SUCCESS,
      product: {
        id: 1,
        name: 'GoPrints',
        description: 'These are the real deal.',
        imageUrl: 'http://example.com/img1.jpg',
        items: [{ id: 4 }],
      },
    };
    expect(
      reducer(initialState, action)
    ).toEqual({
      id: 1,
      name: 'GoPrints',
      description: 'These are the real deal.',
      imageUrl: 'http://example.com/img1.jpg',
      items: [{ id: 4 }],
    });
  });
});
