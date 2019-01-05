import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';
import { ProductList } from '../../src/containers/ProductList';

const homepageCategories = [
  { id: 1, name: 'Make Yours' },
  { id: 2, name: 'Decoration' },
  { id: 3, name: 'Cameras' },
];

const categories = [
  { id: 4, name: 'Prints' },
  { id: 5, name: 'Photobooks' },
  { id: 6, name: 'Home Decor' },
];

const products = [
  {
    id: 1,
    imageUrl: 'http://example.com/img1.jpg',
    name: 'Camera 1',
    price: '$25',
    categories: [1, 4],
  },
  {
    id: 2,
    imageUrl: 'http://example.com/img2.jpg',
    name: 'Camera 2',
    price: '$15',
    categories: [2, 5],
  },
  {
    id: 3,
    imageUrl: 'http://example.com/img2.jpg',
    name: 'Camera 2',
    price: '$15',
    categories: [3, 5],
  }];

describe('ProductList component', () => {
  xit('should render three homepageCategories by default', () => {
    const spy = expect.createSpy();
    const wrapper = mount(
      <ProductList
        dispatch={spy}
      />
    );

    expect(spy).toHaveBeenCalled();
    expect(wrapper.find('ProductCategory').length).toEqual(3);
  });

  xit('should filter products by category', () => {
    expect(ProductList.prototype.filterProductsForCategory(products, 5).length).toEqual(2);
    expect(ProductList.prototype.filterProductsForCategory(products, 1).length).toEqual(1);
  });

  xit('should only render products matching the category filter', () => {
    const spy = expect.createSpy();
    const wrapper = mount(
      <ProductList
        dispatch={spy}
      />
    );

    expect(wrapper.state('categoryFilter')).toEqual(0);

    wrapper.setState({ categoryFilter: 4 });
    expect(wrapper.find('ProductListItem').length).toEqual(1);

    wrapper.setState({ categoryFilter: 5 });
    expect(wrapper.find('ProductListItem').length).toEqual(2);

    wrapper.setState({ categoryFilter: 0 });
    expect(wrapper.find('ProductListItem').length).toEqual(3);
  });

  xit('should only render homepageCategories if they have products', () => {
    const spy = expect.createSpy();
    const wrapper = mount(
      <ProductList
        homepageCategories={homepageCategories}
        categories={categories}
        products={products}
        dispatch={spy}
      />
    );

    expect(wrapper.state('categoryFilter')).toEqual(0);
    expect(wrapper.find('ProductCategory').length).toEqual(3);

    wrapper.setState({ categoryFilter: 4 });
    expect(wrapper.find('ProductCategory').length).toEqual(1);
  });
});
