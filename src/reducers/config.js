import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  appConfig: {},
  multiPhoto: false,
  express: false,
};

function projects(state = initialState, action) {
  switch (action.type) {
    case types.SET_CONFIG:
      return assign({}, state, {
        appConfig: action.config,
      });
    case types.SET_MULTI_PHOTO:
      return assign({}, state, {
        multiPhoto: action.multiPhoto,
      });
    case types.SET_EXPRESS_MODE:
      return assign({}, state, {
        express: action.express,
      });
    default:
      return state;
  }
}

export default projects;
