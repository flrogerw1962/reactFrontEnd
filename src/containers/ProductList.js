import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Link } from 'react-router';
import _ from 'lodash';
import { appConfig, setMultiPhoto, addPhotoItemsOptions } from '../actions/index';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  products: PropTypes.array,
  items: PropTypes.array,
  itemsProject: PropTypes.array,
};

class ProductList extends React.Component {
  constructor() {
    super();
    autoBind(this);
  }

  componentDidMount() {
    // TODO Every time we load the products list component we need to check the URL.
    // In order to setup the webapp with the right information.
    // const full = window.location.host;
    // // window.location.host is subdomain.domain.com
    // const parts = full.split('.');
    // const sub = parts[0];
    // const domain = parts[1];
    // const type = parts[2];
    // console.log(sub, domain, type);
    // const regexParse = new RegExp('[a-z-0-9]{2,63}[a-z]{2,5}$');
    // const urlParts = regexParse.exec(window.location.hostname);
    // console.log(window.location.hostname.replace(urlParts[0], '').slice(0, -1));
    this.props.dispatch(appConfig(3));
  }
  renderProducts() {
    return (this.props.products.map((product, index) => {
      const options = _.head(product.optionItems);
      let item = {};
      if (options !== undefined) {
        item = this.props.items.find((itm) => {
          return itm.id === options.itemId;
        });
        item.name = options.groupName;
      }
      if (_.isEmpty(item)) {
        return null;
      }
      return (
        <div className="col-xs-12 col-sm-6 col-md-6" key={index} >
          <div className="product_content">
            <Link
              to={`/products/${product.id}`}
              onClick={() => {
                this.props.dispatch(setMultiPhoto(false));
                const itm = this.props.itemsProject.find((elm) => {
                  return elm.productId === item.productId;
                });
                if (_.isEmpty(itm)) {
                  debugger; // eslint-disable-line
                  this.props.dispatch(addPhotoItemsOptions({
                    id: item.id,
                    name: item.name,
                    productId: item.productId,
                  }));
                }
              }}
            >
              <div>
                <img src={product.img} alt="Products" />
                <div className="center_text">
                  <h3><p>{product.name}&trade;</p></h3>
                  <span>From ${item.price ? item.price / 100 : '1'}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      );
    }));
  }

  render() {
    return (
      <div className="products__list">
        <div className="content">
          <div className="container">
            <div className="row">
              {this.renderProducts()}
            </div>
          </div>
        </div>
      </div>
      );
  }
}

ProductList.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    products: state.products.list,
    items: state.products.items,
    itemsProject: state.projects.items,
  };
}

export default connect(mapStateToProps)(ProductList);
