import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../../assets/stylesheets/_product-list-item.scss';
import { addPhotoItemsOptions } from '../../../actions/index';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import _ from 'lodash';

const propTypes = {
  product: PropTypes.object,
  item: PropTypes.object,
  dispatch: PropTypes.func,
  items: PropTypes.array,
};
const loadingImg = require('../../../assets/images/loading.gif');

export class ProductListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      showDropdown: false,
    };
    autoBind(this);
  }
  render() {
    const { product, item, items } = this.props;
    if (product.disabled === true) {
      return null;
    }
    const { id, name } = product;
    const { price, preview } = item;
    return (
      <div className="col-xs-12 col-sm-6 col-md-6">
        <Link
          to={`/products/${id}`}
          className="product-list-item"
          onClick={() => {
            const itemInfo = item;
            const itm = items.find((elm) => {
              return elm.productId === id;
            });
            if (_.isEmpty(itm)) {
              this.props.dispatch(addPhotoItemsOptions({
                id: itemInfo.id,
                productId: id,
                name: itemInfo.name,
              }));
            }
          }}
        >
          <div className="product-item">
            <img
              className="imagePreview"
              alt=""
              src={loadingImg}
              data-product-image={preview.img}
              data-product-image-x={preview.x}
              data-product-image-y={preview.y}
              data-product-image-width={preview.width}
              data-product-image-height={preview.height}
            />
            <h3>
              <span>{name}</span>
            </h3>
            <p>From ${price / 100}</p>
          </div>
        </Link>
      </div>
      );
  }
}
function mapStateToProps(state) {
  return {
    items: state.projects.items,
  };
}

ProductListItem.propTypes = propTypes;

export default connect(mapStateToProps)(ProductListItem);
