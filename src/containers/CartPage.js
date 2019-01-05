import React, { PropTypes } from 'react';
import { Link /* , browserHistory */ } from 'react-router';
import { connect } from 'react-redux';
import { updateCartItem, deleteCartItem } from '../actions/';
// import ProductList from './ProductList'; // Only shows when cart is empty
import CartItem from '../components/cart/CartItem';
import Dialog from '../components/cart/ConfirmDialog';
import autoBind from 'react-autobind';
import _ from 'lodash';
import '../assets/stylesheets/_cart-page.scss';

const propTypes = {
  cart: PropTypes.object,
  dispatch: PropTypes.func,
  products: PropTypes.array,
  items: PropTypes.array,
};

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmId: null,
      popLeft: 0,
      popTop: 0,
      qty: 1,
      delivery: 5,
      total: (props.cart.listProducts.reduce((totalPrice, item) => {
        return totalPrice + (item.quantity * item.price);
      }, 0) / 100) + 5,
    };
    autoBind(this);
  }
  componentWillReceiveProps(nextProps) {
    const total = nextProps.cart.listProducts.reduce((totalPrice, item) => {
      return totalPrice + (item.quantity * item.price);
    }, 0);
    this.setState({
      total: (total / 100) + 5,
    });
  }
  /**
   * Update quantity for an item in the cart.
   * When decrementing, if we go to 0, treat it like delete.
   */
  handleQuantityChange(cartItemId, amt, a, e) {
    const { dispatch } = this.props;
    if (amt > 0) {
      dispatch(updateCartItem(cartItemId, {}, amt));
    } else {
      this.setState({
        confirmId: cartItemId,
        popLeft: e.clientX - 220,
        popTop: e.clientY - 130,
        qty: 1,
      });
    }
  }

  confirmDelete(confirmId, e) {
    this.setState({
      confirmId,
      popLeft: e.clientX - 400,
      popTop: e.clientY,
    });
  }

  deleteItem() {
    this.props.dispatch(deleteCartItem(this.state.confirmId));
    this.setState({
      confirmId: null,
    });
  }

  renderCartItems() {
    return this.props.cart.listProducts.map(item => {
      const product = _.head(this.props.products
        .filter(productItem => productItem.id === Number(item.productId)));
      const itemId = _.head(item.items);
      const items = _.head(this.props.items
        .filter(itemElement => itemElement.id === itemId.id));
        // .filter(itemElement => itemElement.productId === Number(item.productId) && itemElement.id === itemId.id));
      const itemDisplay = item.items.map(() => {
        return (
          <CartItem
            key={item.id}
            onIncrease={() => this.handleQuantityChange(item.id, item.quantity + 1, 1)}
            onDecrease={(e) => this.handleQuantityChange(item.id, item.quantity - 1, -1, e)}
          />
          );
      });
      return (
        <div key={item.id} className="cart__item row">
          <div className="col-xs-6">
            <img className="cart__item-photo" src={items.preview.img} alt="" />
          </div>
          <div className="col-xs-6">
            <div className="cart__item-product-name">{product.name}</div>
            <div className="row">
              <div className="cart__item-product-desc col-xs-7">{items.name}</div>
              <div className="col-xs-5 cart__item-product-qty">
                <label htmlFor="qty">QTY:</label>
                <input
                  type="text"
                  id="qty"
                  disabled="true"
                  value={item.quantity}
                  maxLength="3"
                  onKeyPress={(event) => {
                    // Just allow number
                    if (event.charCode >= 48 && event.charCode <= 57) {
                      return true;
                    }
                    event.preventDefault();
                    return false;
                  }}
                  onChange={() => {}}
                >
                </input>
              </div>
            </div>
            <div className="cart__subitem-list row">
              {itemDisplay}
              <div className="cart__item-price col-xs-4">
                <span>${(items.price * item.quantity) / 100}</span>
              </div>
            </div>
          </div>
        </div>
        );
    });
  }

  renderEmptyCart() {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-page__content">
          <h2>Always worth a try.</h2>
          <p>Unfortunately, we don't allow you to purchase empty carts.</p>
          <Link to="/" className="btn cart__continue-shopping">Continue Shopping</Link>
        </div>
      </div>
      );
  }

  render() {
    const { cart } = this.props;
    // No items in cart
    if (!cart.listProducts || cart.listProducts.length === 0) {
      return this.renderEmptyCart();
    }
    // Delete confirmation
    const dialogJSX = this.state.confirmId != null ? (
      <Dialog
        left={this.state.popLeft} top={this.state.popTop}
        onClose={() => this.setState({
          confirmId: null,
        })}
      >Are you sure you want to delete this item from your cart?
        <a
          href="#"
          className="btn"
          onClick={() => {
            this.setState({
              confirmId: null,
            }); }}
        >Cancel</a>
        <a href="#" className="btn" onClick={this.deleteItem}>Delete Forever</a>
      </Dialog>
      ) : '';
    return (
      <div className="content cart">
        <h2>Your Cart</h2>
        {this.renderCartItems()}
        <div className="cart__subtotal">
          <span>Sub Total</span>
          <span className="cart__price">${this.state.total - 5}</span>
        </div>
        <div className="cart__delivery">
          <span>Delivery in 3 business days</span>
          <span className="cart__price">${this.state.delivery}</span>
        </div>
        <div className="cart__total">
          <span>Total</span>
          <span className="cart__price">${this.state.total}</span>
        </div>
        <div className="cart__actions">
          <Link
            to="/"
            onClick={() => {}}
            className="btn cart__continue-shopping"
          >Keep Shopping
          </Link>
          <span>Or</span>
          <Link to="/checkout" className="btn cart__checkout">Checkout</Link>
        </div>
        {dialogJSX}
      </div>
      );
  }
}

CartPage.propTypes = propTypes;
CartPage.clickTimer = null;

export default connect(state => {
  return {
    cart: state.cart,
    products: state.products.list,
    items: state.products.items,
  };
})(CartPage);
