import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import cart from './cart';
import photos from './photos';
import product from './product';
import products from './products';
import projects from './projects';
import tax from './taxes';
import billingAddress from './billingAddress';
import shippingAddress from './shippingAddress';
import config from './config';

const rootReducer = combineReducers({
  cart,
  photos,
  product,
  products,
  projects,
  tax,
  billingAddress,
  shippingAddress,
  config,
  routing,
});

export default rootReducer;
