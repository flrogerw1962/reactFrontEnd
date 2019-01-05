import expect from 'expect';
import reducer from '../../src/reducers/photos';
import * as types from '../../src/actions/actionTypes';

describe('photos reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      photo: {},
      list: [],
      myAccount: undefined,
      facebook: [],
      instagram: {
        data: [],
        pagination: {},
      },
      uploaded: false,
    });
  });

  xit('should handle USERPHOTO_UPLOAD_SUCCESS', () => {
    const initialState = {
      list: ['thisIsAPhotoUrl'],
    };
    const action = {
      type: types.USERPHOTO_UPLOAD_SUCCESS,
      photoUrl: 'anotherPhotoUrl',
    };
    expect(
      reducer(initialState, action)
    ).toEqual({
      list: [
        'thisIsAPhotoUrl',
        'anotherPhotoUrl',
      ],
    });
  });

  it('should handle USERACCOUNT_PHOTOS_FETCH_SUCCESS', () => {
    const initialState = {
      myAccount: [{
        photoUrl: 'thisIsAPhotoUrl',
      }],
    };
    const action = {
      type: types.USERACCOUNT_PHOTOS_FETCH_SUCCESS,
      photos: [{
        photoUrl: 'anotherPhotoUrl',
      }],
    };
    expect(
      reducer(initialState, action)
    ).toEqual({
      myAccount: [{
        photoUrl: 'anotherPhotoUrl',
      }],
    });
  });
});
