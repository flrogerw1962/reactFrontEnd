import React, { PropTypes } from 'react';

const propTypes = {
  Item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

function ProjectItem({ Item, onDelete, onEdit }) {
  // make a pretty string of the options -- IDK what we'll end up displaying but this fit mockup
  const optionStr = Object.keys(Item.options).map((option) => `${option} :  ${Item.options[option]}`).join();
  return (
    <div className="cart__item">
      <img className="cart__item-photo" src={Item.photoCustomization.photoUrl} alt="" />
      <div className="cart__item-product-name">{Item.productName}</div>
      <div className="cart__item-product-desc">{optionStr}</div>
      <div className="cart__item-product-desc">{Item.name}</div>
      <div className="cart__subitem">
        <i className="fa fa-pencil" onClick={onEdit}></i>
        <i className="fa fa-trash" onClick={onDelete}></i>
      </div>
    </div>
    );
}

ProjectItem.propTypes = propTypes;

export default ProjectItem;
