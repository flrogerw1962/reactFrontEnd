import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import ProductListItem from '../../src/components/home/product/ProductListItem';

describe('ProductListItem component', () => {
  xit('should have an image, name, and price', () => {
    const product = {
      imageUrl: 'http://producturl.com',
      name: 'product name',
    };
    const item = [{
      id: 1,
      productId: 1,
      name: 'Small GoPrint (3.5 x 4.25)',
      preview: {},
      disabled: false,
      sku: '703040',
      price: 100,
    }];

    const wrapper = shallow(<ProductListItem product={product} item={item} />);

    // expect(wrapper.find('img').html()).toInclude('http://producturl.com');
    expect(wrapper.find('h3').text()).toEqual('product name');
    expect(wrapper.find('p').text()).toEqual('From $1');
  });
});
