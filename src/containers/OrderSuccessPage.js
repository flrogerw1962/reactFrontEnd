import React from 'react';
import { Link } from 'react-router';
// import ProductList from './ProductList';

import '../assets/stylesheets/_order-success-page.scss';

function OrderSuccessPage() {
  return (
    <div className="order-success-page">
      <div className="order-success-page__body">
        <div className="content">
          <div className="order-success-page__header">Thanks for printing!</div>
          <div className="order-success-page__text">
            If you'd like a chance to win free products, take a second to show off your order to your friends!
          </div>
          <Link to="#" className="btn share-btn order-success-page__fb-btn">Share on Facebook</Link>
          <Link to="#" className="btn share-btn order-success-page__tw-btn">Share on Twitter</Link>
          <Link to="#" className="btn share-btn">Share via Email</Link>
        </div>
      </div>
      {/* <ProductList /> */}
    </div>
    );
}

export default OrderSuccessPage;
