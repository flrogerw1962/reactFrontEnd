import React, { PropTypes } from 'react';

const propTypes = {
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
};

function CartItem({ onIncrease, onDecrease }) {
  return (
    <div className="cart__subitem">
      <div className="cart__subitem-qty">
        <div className="dec_button col-xs-4" onClick={onDecrease}>
          <i className="fa fa-minus"></i>
        </div>
        <div className="inc_button col-xs-4" onClick={onIncrease}>
          <i className="fa fa-plus"></i>
        </div>
      </div>
    </div>
    );
}

CartItem.propTypes = propTypes;

export default CartItem;
