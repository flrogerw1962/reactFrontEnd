import React, { PropTypes } from 'react';
import Card from 'react-credit-card';
import Select from 'react-select';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import scriptLoader from 'react-async-script-loader';
import _ from 'lodash';
import InputElement from 'react-input-mask';
import '../../assets/stylesheets/_payment-page.scss';
import '../../assets/stylesheets/vendor/card.css';
import '../../assets/stylesheets/vendor/card-type.css';
import { placeOrder } from '../../actions/index';

const propTypes = {
  email: PropTypes.string,
  isScriptLoaded: PropTypes.any,
  cart: PropTypes.object,
  tax: PropTypes.number,
  dispatch: PropTypes.func,
};

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeLoading: true,
      stripeLoadingError: false,
      submitDisabled: false,
      paymentError: null,
      paymentComplete: false,
      token: '',
      exp_month: 1,
      exp_year: new Date().getFullYear(),
      cvc: '',
      cardFocus: '',
      number: '',
      email: props.email,
      name: '',
      giftCode: '',
      error: false,
      mask: '9999-9999-9999-9999',
      cvcLength: 3,
      total: props.cart.listProducts.reduce((totalPrice, item) => {
        return totalPrice + (item.quantity * item.price);
      }, 0) / 100,
      taxTotal: 0,
      shipping: 5.00,
    };
    autoBind(this);
    this.monthList = Array.from(Array(12).keys()).map((v, i) => {
      const month = 1 + i;
      return {
        value: month.toString(),
        label: (`0${month.toString()}`).slice(-2),
      };
    });
    this.yearList = Array.from(Array(15).keys()).map((v, i) => {
      const year = new Date().getFullYear() + i;
      return {
        value: year.toString(),
        label: year.toString(),
      };
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (nextProps.isScriptLoadSucceed) {
        this.onScriptLoaded();
      } else this.onScriptError();
    }
    if (nextProps.email) {
      this.setState({
        email: nextProps.email,
      });
    }
    if (nextProps.tax !== 0) {
      this.setState({
        taxTotal: this.props.cart.listProducts.reduce((taxTotal, item) => {
          return taxTotal + ((item.price / 100) * (nextProps.tax * 100)) * item.quantity;
        }, 0) / 100,
      });
    } else {
      this.setState({ taxTotal: 0 });
    }
  }

  onScriptLoaded() {
    if (!PaymentForm.getStripeToken) {
      this.setState({
        stripeLoading: false,
        stripeLoadingError: false,
      });
    }
  }

  onScriptError() {
    this.setState({
      stripeLoading: false,
      stripeLoadingError: true,
    });
  }

  onSubmit() {
    this.setState({
      submitDisabled: true,
      paymentError: null,
    });
    const { number, exp_month, exp_year, cvc } = this.state;
    const cardNumber = number.replace(/(x_*)|(-)|(_)/g, '');
    const payment = {
      number: cardNumber,
      exp_month,
      exp_year,
      cvc,
    };
     // send form here
    Stripe.createToken(payment, (status, response) => {
      if (response.error) {
        this.setState({
          paymentError: response.error.message,
          submitDisabled: false,
        });
      } else {
        this.setState({
          paymentComplete: true,
          submitDisabled: false,
          token: response.id,
        });
      // make request to your server here!
        this.props.dispatch(placeOrder(response.id));
      }
    });
  }

  validateEmail() {
    this.setState({
      error: _.assign(this.state.error, {
        email: !this.validEmail(),
      }),
    });
  }
  validEmail() {
    const empty = this.state.email !== '';
    const emailPattern = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]+@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm;
    const validEmail = emailPattern.test(this.state.email);
    return empty && validEmail;
  }
  renderEmailErrors() {
    return this.state.error.email ? <div className="checkout-page__alert">* Please enter a valid email</div> : null;
  }
  render() {
    const dateExp = this.state.exp_month > 9 ?
      this.state.exp_month.toString() + this.state.exp_year.toString() :
      `0${this.state.exp_month.toString()}${this.state.exp_year.toString().slice(-2)}`;
    if (this.state.stripeLoading) {
      return <div>Loading</div>;
    }
    if (this.state.paymentComplete) {
      return <div>Payment Complete!</div>;
    }
    return (
      <div className="payment_form">
        <div className="input-group payment-page__input">
          <span className="input-group-addon">
            <i className="fa fa-envelope-o fa-fw"></i>
          </span>
          <input
            className="payment-page__input"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            onBlur={this.validateEmail}
            type="email"
            placeholder="Email Address"
            required
          />
        </div>
        {this.renderEmailErrors()}
        <div className="content cart">
          <div className="row">
            <span className="col-xs-8">
              <div className="input-group payment-page__input_gift_code">
                <span className="input-group-addon">
                  <i className="fa fa-gift fa-fw"></i>
                </span>
                <input
                  value={this.state.giftCode}
                  onChange={e => this.setState({ giftCode: e.target.value })}
                  type="text"
                  placeholder="Gift Card Code"
                />
              </div>
            </span>
            <a
              onClick={() =>
               this.setState({ reviewingOrder: true })
              }
              className="btn apply_gift_code col-xs-4" href="#"
            > Apply
            </a>
          </div>
        </div>
        <h3>Payment Information</h3>
        <div>
          <Card
            expiry={dateExp}
            cvc={this.state.cvc}
            number={this.state.number.replace(/(x_*)|(-)|(_)/g, '')}
            focused={this.state.cardFocus}
            namePlaceholder={this.state.name}
          />
          <span className="checkout-page__alert">{this.state.paymentError}</span><br />
          <div className="input-group payment-page__input">
            <span className="input-group-addon">
              <i className="fa fa-credit-card-alt fa-fw"></i>
            </span>
            <InputElement
              mask={this.state.mask}
              value={this.state.number}
              type="text" className="payment-page__input"
              data-stripe="number"
              placeholder="Credit Card Number"
              onChange={event => {
                const value = event.target.value;
                const newState = {
                  mask: '9999-9999-9999-9999',
                  number: value,
                  cvcLength: 3,
                };
                if (/^3[47]/.test(value)) {
                  newState.mask = '9999-999999-99999';
                  newState.cvcLength = 4;
                }
                this.setState(newState);
              }}
              required
              maxLength={16}
              onFocus={() => this.setState({ cardFocus: 'number' })}
              onBlur={() => this.setState({ cardFocus: 'null' })}
            />
          </div>
          <br />
          <div className="cart">
            <i className="fa fa-calendar fa-fw" style={{ margin: '5px 10px' }}></i>
            <span>Expiration date</span>
            <div className="row">
              <Select
                clearable={false}
                value={this.state.exp_month}
                onChange={selected => this.setState({
                  exp_month: selected.value,
                })}
                className="col-xs-6"
                placeholder="Month"
                options={this.monthList}
                inputProps={{ 'data-stripe': 'exp-month' }}
                onFocus={() => this.setState({ cardFocus: 'expiry' })}
                onBlur={() => this.setState({ cardFocus: 'null' })}
              />
              <Select
                clearable={false}
                value={this.state.exp_year}
                onChange={selected => this.setState({
                  exp_year: selected.value,
                })}
                className="col-xs-6"
                placeholder="Year"
                options={this.yearList}
                inputProps={{ 'data-stripe': 'exp-year' }}
                onFocus={() => this.setState({ cardFocus: 'expiry' })}
                onBlur={() => this.setState({ cardFocus: 'null' })}
              />
            </div>
          </div>
          <div className="input-group payment-page__input">
            <span className="input-group-addon">
              <i className="fa fa-lock fa-fw"></i>
            </span>
            <input
              type="text"
              className="payment-page__input"
              data-stripe="CVC"
              placeholder="CVV/CVC/CID"
              onChange={e => this.setState({
                cvc: e.target.value,
              })}
              value={this.state.cvc}
              required
              onKeyPress={(event) => {
                // Just allow number
                if (event.charCode >= 48 && event.charCode <= 57) {
                  return true;
                }
                event.preventDefault();
                return false;
              }}
              maxLength={this.state.cvcLength}
              onFocus={() => this.setState({ cardFocus: 'cvc' })}
              onBlur={() => this.setState({ cardFocus: 'null' })}
            />
          </div>
          <div className="input-group payment-page__input">
            <span className="input-group-addon">
              <i className="fa fa-user fa-fw"></i>
            </span>
            <input
              type="text"
              className="payment-page__input"
              placeholder="Name on the card"
              onChange={e => this.setState({
                name: e.target.value,
              })}
              value={this.state.name}
              required
              onFocus={() => this.setState({ cardFocus: 'name' })}
              onBlur={() => this.setState({ cardFocus: 'null' })}
            />
          </div>
          <br />
          <div>
            <table className="table_checkout" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.props.cart.listProducts.map((item, index) => {
                  return (<tr key={index}>
                    <td>{_.head(item.items).name}</td>
                    <td>{item.quantity}</td>
                    <td>${((item.price / 100) * item.quantity).toFixed(2)}</td>
                  </tr>);
                })}
                <tr>
                  <td>Express Shipping</td>
                  <td></td>
                  <td>${this.state.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Sales Tax ({(this.props.tax * 100).toFixed(1)}%)</td>
                  <td></td>
                  <td>${this.state.taxTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Grand Total</td>
                  <td></td>
                  <td>${(this.state.total + this.state.taxTotal + this.state.shipping).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="checkout__actions">
          <input
            className="btn"
            disabled={this.state.submitDisabled}
            onClick={() => {
              this.onSubmit();
            }}
            type="submit"
            value="Submit Order"
          />
        </div>
      </div>
      );
  }
}

PaymentForm.propTypes = propTypes;

const Payment = scriptLoader(
  'https://js.stripe.com/v2/'
)(PaymentForm);

export default connect()(Payment);
