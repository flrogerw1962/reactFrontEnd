import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { fetchCart, fetchUser, fetchAddresses } from '../actions/';
import CheckoutItem from '../components/checkout/CheckoutItem';
import Address from '../components/checkout/Address.js';
import PaymentForm from '../components/checkout/PaymentForm.js';
import autoBind from 'react-autobind';
import _ from 'lodash';
import '../assets/stylesheets/_checkout-page.scss';

const propTypes = {
  cart: PropTypes.object,
  shippingAddress: PropTypes.object,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  tax: PropTypes.array,
};

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingAddress: {
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      },
      giftNote: '',
      email: '',
      reviewingOrder: false,
      billToSame: false,
      taxRate: 0,
    };
    autoBind(this);
  }

  componentWillMount() {
    const taxRate = this.props.tax.find((taxItem) => {
      return taxItem.zipcode === Number(this.props.shippingAddress.zipCode);
    });
    if (taxRate !== undefined) {
      this.setState({
        taxRate: taxRate.tax,
      });
    }
  }
  billToSame(e) {
    const checked = e.currentTarget.checked;
    this.setState({
      billToSame: checked,
    });
    if (checked) {
      this.props.dispatch({
        type: 'UPDATE_BILLING_ADDRESS',
        map: this.props.shippingAddress,
      });
      this.setState({
        billingAddress: this.props.shippingAddress,
      });
    }
  }

  renderCartItems() {
    return this.props.cart.list.map(item => {
      const itemDisplay = item.itemList.map(subitem => <CheckoutItem key={subitem.cartItemId} Item={subitem} />);
      return (
        <div key={item.itemId} className="cart__item">
          <img className="cart__item-photo" src={item.productImageUrl} alt="" />
          <div className="cart__item-group">
            <div className="cart__item-product-name">{item.productName}</div>
            <div className="cart__item-product-desc">{item.itemName}</div>
            <div className="cart__item-price">${item.totalPrice}</div>
          </div>
          <div className="cart__subitem-list">
            {itemDisplay}
          </div>
        </div>
        );
    });
  }

  render() {
    // const { cart } = this.props;
    return (
      <div>
        <div className="content cart">
          {/* {this.renderCartItems()} */}
          <h1>Checkout</h1>
          <div style={{ width: '100%' }}>
            <h3>Add a Handwritten Gift Note (free):</h3>
            <textarea
              defaultValue={this.state.giftNote}
              style={{ width: '100%' }}
              placeholder="Enter your gift message (250 char.max)"
            />
          </div>

          <div className="cart__subitem"><h3>Shipping Address</h3></div>
          <Address
            address={this.props.shippingAddress}
            onSave={map => {
              const value = _.get(map, 'zipCode');
              // const value = Ob
              this.props.dispatch({
                type: 'UPDATE_SHIPPING_ADDRESS',
                map,
              });
              if (value !== undefined) {
                const taxRate = this.props.tax.find((taxItem) => {
                  return taxItem.zipcode === Number(value);
                });
                if (taxRate !== undefined) {
                  this.setState({
                    taxRate: taxRate.tax,
                  });
                } else {
                  this.setState({
                    taxRate: 0.00,
                  });
                }
              }
            }}
          />
          <div className="cart__subitem"><h3>Billing Address</h3></div>
          <label>
            <input
              onChange={e => this.billToSame(e)}
              checked={this.state.billToSame}
              type="checkbox"
            /> Same as Shipping Address
          </label>
          {this.state.billToSame === false ? <Address
            address={this.state.billingAddress}
            onSave={map => this.props.dispatch({
              type: 'UPDATE_BILLING_ADDRESS',
              map,
            })}
          /> : null}
          <PaymentForm
            email={this.state.email}
            onScriptLoaded={() => {
              Stripe.setPublishableKey('pk_test_F3i81yKFPUrXd3ifjWHaQo15');
            }}
            cart={this.props.cart}
            tax={this.state.taxRate}
          />
        </div>
      </div>
      );
  }

}

CheckoutPage.propTypes = propTypes;

export default connect(state => { // eslint-disable-line arrow-body-style
  return {
    billingAddress: state.billingAddress,
    cart: state.cart,
    shippingAddress: state.shippingAddress,
    tax: state.tax.taxList,
  };
})(CheckoutPage);
