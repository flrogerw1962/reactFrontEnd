import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  photo: {},
  list: [],
  myAccount: [],
  facebook: [],
  instagram: {
    data: [],
    pagination: {},
  },
  uploaded: false,
};

function photos(state = initialState, action) {
  switch (action.type) {
    case types.SELECTED_PHOTO:
      return assign({}, state, {
        photo: action.photo,
      });

    case types.USERPHOTO_UPLOAD_SUCCESS:
      return assign({}, state, {
        uploaded: action.uploaded,
      });

    case types.USERPHOTO_UPLOAD_ERROR:
      return assign({}, state, {
        uploaded: action.uploaded,
      });

    case types.CLEAR_CURRENT_PROJECT:
      return assign({}, state, {
        list: [],
      });

    case types.USERACCOUNT_PHOTOS_FETCH_SUCCESS:
      return assign({}, state, {
        myAccount: action.photos,
      });

    case types.FACEBOOK_FETCH_IMAGES:
      return assign({}, state, {
        facebook: action.photosFacebook,
      });

    case types.INSTAGRAM_FETCH_IMAGES:
      return assign({}, state, {
        instagram: {
          data: action.photosInstagram.data,
          pagination: action.photosInstagram.pagination,
        },
      });
    default:
      return state;
  }
}

export default photos;
