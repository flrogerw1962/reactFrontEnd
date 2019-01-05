import expect from 'expect';
import reducer from '../../src/reducers/projects';
import * as types from '../../src/actions/actionTypes';

describe('projects reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      current: {
        canvasData: {},
        photoUrl: undefined,
        edits: {},
      },
      items: [],
      list: [],
      quantity: 1,
      selectedPhotoId: null,
    });
  });

  xit('should handle USERPHOTO_UPLOAD_SUCCESS', () => {
    const initialState = {
      list: [],
    };
    const action = {
      type: types.USERPHOTO_UPLOAD_SUCCESS,
      photoId: 5,
      itemId: 3,
      photoUrl: 'http://example.com/img1.jpg',
    };
    expect(
      reducer(initialState, action)
    ).toEqual({
      list: [],
      current: {
        photoCustomization: {
          photoId: 5,
          photoUrl: 'http://example.com/img1.jpg',
          edits: [],
        },
      },
    });
  });
});
