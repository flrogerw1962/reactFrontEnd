import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ProductPage from './containers/ProductPage';
import CartPage from './containers/CartPage';
import CheckoutPage from './containers/CheckoutPage';
import OrderSuccessPage from './containers/OrderSuccessPage';
import PhotoEditingBay from './containers/PhotoEditingBay';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/upload-photo" component={PhotoEditingBay} />
    <Route path="/customize" component={PhotoEditingBay} />
    <Route path="/products" component={ProductPage} />
    <Route path="/products/:id" component={ProductPage} />
    <Route path="/cart" component={CartPage} />
    <Route path="/checkout" component={CheckoutPage} />
    <Route path="/order-success" component={OrderSuccessPage} />
    <Route path="/responseInstagram" component={HomePage} />
  </Route>
);
