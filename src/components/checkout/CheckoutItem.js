import React from 'react';

function CheckoutItem({ Item }) {
  return (
    <div className="cart__subitem">
      <img className="cart__subitem-photo" src={Item.photoCustomization.photoUrl} alt="" />
      <div className="cart__subitem-qty">
        {Item.quantity}
      </div>
    </div>
    );
}

CheckoutItem.propTypes = {
  Item: React.PropTypes.object.isRequired,
};

export default CheckoutItem;
