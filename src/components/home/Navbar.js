import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import autoBind from 'react-autobind';

import '../../assets/stylesheets/_navbar.scss';

const propTypes = {
  cart: PropTypes.object,
  dispatch: PropTypes.func,
};

const logoImg = require('../../assets/images/express_logo.png');

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      showDropdown: false,
    };
    autoBind(this);
  }
  openNav() {
    document.getElementById('sidenav-wrapper').style.width = '100%';
    document.getElementById('sidenav-content').style.width = '45%';
  }
  closeNav() {
    document.getElementById('sidenav-wrapper').style.width = '0%';
    document.getElementById('sidenav-content').style.width = '0%';
  }

  render() {
    const cartCount = <div className="cart-badge">{this.props.cart.quantity}</div>;
    return (
      <div className="navbar">
        <div className="navbar__brand">
          <Link to="/"><img src={logoImg} className="navbar__logo" alt="" /></Link>
        </div>
        <div className="navbar__item">
          <Link to="/upload-photo">
            <span className="fa-stack fa-lg">
              <i
                className="fa fa-camera fa-stack-2x"
                style={{
                  fontSize: '40px',
                  top: '3px',
                }}
              >
              </i>
              <i
                className="fa fa-plus-circle fa-stack-1x fa-inverse"
                style={{
                  margin: '5px 3px',
                }}
              >
              </i>
            </span>
          </Link>
        </div>
        <div className="navbar__item">
          <Link to="/cart">
            <span>
              <i className="fa fa-shopping-cart fa-3x"></i>
            </span>
            {cartCount}
          </Link>
        </div>
        <div className="navbar__item">
          <i className="fa fa-bars fa-3x" onClick={this.openNav} ></i>
        </div>
        <div id="sidenav-wrapper" className="sidenav-blackout" onClick={this.closeNav}>
          <div id="sidenav-content" className="sidenav">
            <a className="closebtn" onClick={this.closeNav}>&times;</a>
            <a href="/">Home</a>
            <a href="#">About Us</a>
            <a href="#">FAQs</a>
            <a href="#">Stores</a>
          </div>
        </div>
      </div>
      );
  }
}

Navbar.propTypes = propTypes;

export default connect((state) => {
  return {
    cart: state.cart,
  };
})(Navbar);
