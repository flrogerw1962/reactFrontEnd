import { assign } from 'lodash';
import * as types from '../actions/actionTypes';

const initialState = {
  listProducts: [],
  quantity: 0,
  totalPrice: 0,
};

function cart(state = initialState, action) {
  switch (action.type) {

    case types.ADD_CART_ITEM:
      return assign({}, state, {
        listProducts: [...state.listProducts, {
          id: state.listProducts.reduce((maxId, cartItem) => Math.max(cartItem.id, maxId), -1) + 1,
          productId: action.productId,
          quantity: action.qty,
          items: [action.item],
          photoCustomization: action.photoCustomization,
          price: action.price,
        }],
        quantity: state.quantity + 1,
      });

    case types.EDIT_CART_ITEM:
      return assign({}, state, {
        listProducts: state.listProducts.map(cartProduct => {
          return cartProduct.id === action.cartItemId ?
            assign({}, cartProduct, { items: cartProduct.items.map(cartItem => {
              return cartItem.id === action.cartItemId ?
                assign({}, cartItem, action.item) : cartItem;
            }),
            quantity: action.qty,
          }) : cartProduct;
        }),
      });

    case types.REMOVE_CART_ITEM:
      return assign({}, state, {
        listProducts: state.listProducts.filter(item =>
          item.id !== action.itemId
        ),
        quantity: state.quantity - 1,
      });
    case types.CHECKOUT:
      return assign({}, state, {
        totalPrice: action.price,
      });
    case types.CLEAR_CART:
      return initialState;
    default:
      return state;
  }
}

export default cart;
