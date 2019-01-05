import React from 'react';
import { connect } from 'react-redux';
import ProductList from './ProductList';
import Subheader from '../components/home/Subheader';

function HomePage(props) {
  return (
    <div>
      <Subheader {...props} />
      <ProductList />
    </div>
    );
}

export default connect()(HomePage);
