// import React from 'react';
// import { shallow } from 'enzyme';
// import expect from 'expect';
// import { ProductPage } from '../../src/containers/ProductPage';
//
// const product = {
//   id: 1,
//   name: 'GoPrints',
//   description: 'This is a product',
//   imageUrl: 'http://example.com/img1.jpg',
//   selectedItemId: 3,
// };
//
// describe('ProductPage component', () => {
//   const spy = expect.createSpy();
//   const wrapper = shallow(
//     <ProductPage
//       params={{ id: 'goprints' }}
//       dispatch={spy}
//       projects={{ list: [] }}
//       product={product}
//     />
//   );
//
//   it('dispatches an action', () => {
//     expect(spy).toHaveBeenCalled();
//   });
//
//   it('contains additional components', () => {
//     expect(wrapper.find('ProductForm').length).toEqual(1);
//     expect(wrapper.find('Connect(ProductList)').length).toEqual(1);
//     expect(spy).toHaveBeenCalled();
//   });
//
//   it('shows the editing bay', () => {
//     expect(wrapper.find('#make-yours-btn').length).toEqual(1);
//     expect(wrapper.find('#add-to-cart-btn-disabled').length).toEqual(0);
//     expect(wrapper.find('Connect(PhotoEditingBay)').length).toEqual(0);
//
//     wrapper.setState({ isEditing: true });
//     expect(wrapper.find('#make-yours-btn').length).toEqual(0);
//     expect(wrapper.find('#add-to-cart-btn-disabled').length).toEqual(1);
//     expect(wrapper.find('Connect(PhotoEditingBay)').length).toEqual(1);
//
//     wrapper.setState({ isEditing: false });
//     expect(wrapper.find('#make-yours-btn').length).toEqual(1);
//     expect(wrapper.find('#add-to-cart-btn-disabled').length).toEqual(0);
//     expect(wrapper.find('Connect(PhotoEditingBay)').length).toEqual(0);
//   });
//
//   it('shows enabled Add to Cart button when user has projects', () => {
//     const spyTwo = expect.createSpy();
//     const wrapperTwo = shallow(
//       <ProductPage
//         params={{ id: 'goprints' }}
//         dispatch={spyTwo}
//         projects={{ list: [{ itemId: 3 }] }}
//         product={product}
//       />
//     );
//
//     wrapperTwo.find('#add-to-cart-btn').simulate('click');
//     expect(spyTwo).toHaveBeenCalled();
//   });
// });
