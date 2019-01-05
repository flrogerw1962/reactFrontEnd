import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  current: {
    photoUrl: {},
    edits: {},
    canvasData: {},
  },
  items: [],
  list: [],
  quantity: 1,
  selectedPhotoId: null,
};

function projects(state = initialState, action) {
  switch (action.type) {
    case types.START_PROJECT:
      return assign({}, state, {
        current: assign({}, state.current, {
          photoUrl: action.photoUrl,
        }),
      });
    case types.ADD_EDIT_PHOTO_TO_PROJECT:
      return assign({}, state, {
        current: assign({}, state.current, {
          canvasData: action.canvasData,
          jsonResult: action.jsonResult,
        }),
      });
    case types.ADD_PHOTO_TO_PROJECT:
      return assign({}, state, {
        current: assign({}, state.current, {
          photoUrl: action.photo,
          edits: {},
          canvasData: {},
          jsonResult: {},
        }),
      });
    case types.ADD_PHOTO_ITEMS_OPTIONS:
      return assign({}, state, {
        items: [
          ...state.items,
          action.item,
        ],
      });

    case types.EDIT_PHOTO_ITEMS_OPTIONS:
      return assign({}, state, {
        items: state.items.map(item => {
          return item.name === action.nameOption && item.productId === action.productId ?
            assign({}, item, { id: action.id, productId: action.productId }) : item;
        }),
      });
    case types.CLEAR_EDIT_PHOTO_TO_PROJECT:
      return assign({}, state, {
        current: assign({}, state.current, {
          canvasData: {},
        }),
      });
    case types.PROJECTS_CLEAR_CURRENT:
      return assign({}, state, {
        current: assign({}, state.current, {
          photoUrl: {},
          edits: {},
          canvasData: {},
        }),
      });
    case types.ADD_ITEMS_QUANTITY:
      return assign({}, state, {
        quantity: action.qty,
      });
    case types.ADD_PHOTOS_TO_LIST:
      return assign({}, state, {
        list: [
          ...state.list,
          {
            id: state.list.reduce((maxId, project) => Math.max(project.id, maxId), -1) + 1,
            photoUrl: action.item,
            edits: {},
            canvasData: {},
          },
        ],
      });
    case types.REMOVE_PHOTO_FROM_LIST:
      return assign({}, state, {
        list: state.list.filter(item =>
          item.id !== action.itemId
        ),
      });
    case types.CLEAR_PROJECT_LIST:
      return assign({}, state, {
        list: [],
      });
    case types.SET_SELECTED_PHOTO_ID:
      return assign({}, state, {
        selectedPhotoId: action.id,
      });
    default:
      return state;
  }
}

export default projects;
