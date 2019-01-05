import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { browserHistory } from 'react-router';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ProductOptions from '../../../components/home/product/ProductOptions';
import { editPhotoItemsOptions, addPhotoItemsOptions, addItemsQuantity,
  saveCartItem, setMultiPhoto, setExpressMode, removePhotoFromList, setSelectedPhotoId } from '../../../actions/';
import _ from 'lodash';
import { getThumbnail } from '../../../utils/thumbnailCreator';

const propTypes = {
  products: PropTypes.any,
  photo: PropTypes.object,
  edits: PropTypes.object,
  jsonResult: PropTypes.object,
  items: PropTypes.array,
  productId: PropTypes.string,
  projectItems: PropTypes.array,
  quantity: PropTypes.number,
  dispatch: PropTypes.func,
  list: PropTypes.array,
  multiPhoto: PropTypes.bool,
};
const loadingImg = require('../../../assets/images/loading.gif');

export class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    const qty = [];
    for (let i = 1; i <= 50; i++) {
      qty.push({
        value: i,
        label: i,
      });
    }
    this.state = {
      price: 0,
      qtyValue: props.quantity || 1,
      product: {},
      item: {},
      qty,
    };
    autoBind(this);
  }

  componentWillMount() {
    const product = _.head(this.props.products
      .filter((productFilter) => productFilter.id === Number(this.props.productId)));
    if (product) {
      this.setState({
        product,
      });
    }
  }

  componentDidMount() {
    if (_.isEmpty(this.state.product)) {
      browserHistory.push('/products');
    }
  }

  renderOptions() {
    const { dispatch } = this.props;
    return this.state.product.optionGroups.map((productOpt, index) => {
      const name = productOpt.name;
      const items = this.state.product.optionItems
        .filter((item) => item.groupName === productOpt.name)
        .map((item) => {
          return {
            label: item.name,
            value: item.itemId,
            groupName: item.groupName,
          };
        });
      const itemDefault = {
        id: _.head(items).value,
        name,
        productId: this.state.product.productId,
      };
      const currentItems = this.props.projectItems.filter((gpItem) => gpItem.name === name);
      if (_.isEmpty(currentItems)) {
        dispatch(addPhotoItemsOptions(itemDefault));
      }
      return (
        <div key={index}>
          <ProductOptions
            value={itemDefault.id}
            name={name}
            options={items}
            callback={(option, nameOption) => {
              const itemList = this.props.items;
              const item = _.head(itemList.filter((itemElement) => {
                return itemElement.id === option.value;
              }
              ));
              this.setState({ price: item.price, item });
              this.props.dispatch(editPhotoItemsOptions(option.value, nameOption, Number(this.props.productId)));
            }}
          />
        </div>
      );
    });
  }

  render() {
    if (!_.isEmpty(this.state.product)) {
      if (!_.isEmpty(this.props.photo)) getThumbnail(this.props.photo, this.props.edits, this.props.jsonResult);
      if (this.props.multiPhoto && !_.isEmpty(this.props.list)) {
        // we can create a new image preview component
        const item = this.props.projectItems.find((items) => { return items.name === 'Size'; });
        const itemInfo = this.props.items.find((itm) => { return itm.id === item.id && itm.productId === item.productId; });
        return (
          <div className="products-page">
            <div className="container multi_photo">
              <h2>{this.state.product.name}</h2>
              <h3>{itemInfo.name} ${itemInfo.price / 100} each </h3>
              <div className="row">
              {this.props.list.map((project) => {
                return (
                  <div key={project.id} className="col-xs-12 col-sm-6">
                    <img
                      src={project.photoUrl}
                      alt=""
                    />
                    <input
                      onClick={() => {
                        this.props.dispatch(setSelectedPhotoId(project.id));
                        browserHistory.push('/customize');
                      }}
                      type="button"
                      className="btn"
                      value="Edit Photo"
                      id="customize-btn"
                    />
                    <input
                      onClick={() => {
                        this.props.dispatch(removePhotoFromList(project.id));
                      }}
                      type="button"
                      className="btn"
                      value="Delete item"
                      id="customize-btn"
                    />
                  </div>
                );
              })}
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <input
                    onClick={() => {
                      this.props.dispatch(setMultiPhoto(true));
                      this.props.dispatch(setExpressMode(false));
                      browserHistory.push('/upload-photo');
                    }}
                    type="button"
                    className="btn"
                    value="Add More Photos"
                    id="add-to-cart-btn"
                  />
                  <input
                    onClick={() => {
                      if (!this.props.multiPhoto) {
                        this.props.dispatch(saveCartItem(this.state.item, this.props.productId,
                          this.props.edits, this.state.qtyValue, this.state.item.price));
                      } else {
                        this.props.list.forEach((itm) => {
                          this.props.dispatch(saveCartItem(itemInfo, this.props.productId,
                            itm.edits, 1, itemInfo.price));
                        });
                        this.props.list.forEach((data, index) => {
                          this.props.dispatch(removePhotoFromList(index));
                        });
                      }
                      browserHistory.push('/cart');
                    }}
                    type="button"
                    className="btn"
                    value={`Add to cart (${this.props.list.length})`}
                    id="add-to-cart-btn"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
      let itemInfo;
      let item;
      if (!_.isEmpty(this.props.projectItems)) {
        // eslint-disable-next-line max-len
        item = this.props.projectItems.find((items) => {
          return items.name === 'Size' && items.productId === Number(this.props.productId);
        });
        if (_.isEmpty(item)) {
          item = this.props.projectItems.find((items) => {
            return items.name === 'Color' && items.productId === Number(this.props.productId);
          });
        }
        itemInfo = this.props.items.find((itm) => { return itm.id === item.id; });
      }
      return (
        <div className="products-page">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <div className="product-img-preview">
                  {!_.isEmpty(itemInfo) ?
                    <img
                      src={this.props.photo ? this.state.product.img : loadingImg}
                      alt="product-preview"
                      className="imagePreview"
                      data-product-image={_.isEmpty(itemInfo) ? this.state.item.preview.img : itemInfo.preview.img}
                      data-product-image-x={_.isEmpty(itemInfo) ? this.state.item.preview.x : itemInfo.preview.x}
                      data-product-image-y={_.isEmpty(itemInfo) ? this.state.item.preview.y : itemInfo.preview.y}
                      data-product-image-width={_.isEmpty(itemInfo) ? this.state.item.preview.width : itemInfo.preview.width}// eslint-disable-line
                      data-product-image-height={_.isEmpty(itemInfo) ? this.state.item.preview.height : itemInfo.preview.height}// eslint-disable-line
                    /> :
                    <img
                      src={this.props.photo ? this.state.product.img : loadingImg}
                      alt="product-preview"
                      className="imagePreview"
                    />}
                </div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <div className="product-form">
                  <h2>{this.state.product.name}</h2>
                  {this.renderOptions()}
                  {!_.isEmpty(this.props.photo) ? <div>
                    <span>QTY:</span>
                    <Select
                      clearable={false}
                      value={this.state.qtyValue}
                      onChange={id => {
                        this.props.dispatch(addItemsQuantity(id.value));
                        this.setState({ qtyValue: id.value });
                      }}
                      name="form-field-name1"
                      options={this.state.qty}
                    />
                    <span style={{ paddingLeft: '20px' }}>
                      ${this.state.price ? this.state.price / 100 : 0}
                    </span>
                  </div> : <span style={{ paddingLeft: '20px' }}>
                    ${this.state.price ? this.state.price / 100 : 0}
                  </span>}
                  {!_.isEmpty(this.props.photo) ? <div>
                    <input
                      onClick={() => {
                        browserHistory.push('/customize');
                      }}
                      type="button"
                      className="btn"
                      value="Edit Photo"
                      id="customize-btn"
                    />
                    <input
                      onClick={() => {
                        this.props.dispatch(setMultiPhoto(false));
                        this.props.dispatch(setExpressMode(false));
                        browserHistory.push('/upload-photo');
                      }}
                      type="button"
                      className="btn"
                      value="Change photo"
                      id="add-to-cart-btn"
                    />
                    <input
                      onClick={() => {
                        this.props.dispatch(setMultiPhoto(true));
                        this.props.dispatch(setExpressMode(false));
                        browserHistory.push('/upload-photo');
                      }}
                      type="button"
                      className="btn"
                      value="Add More Photos"
                      id="add-to-cart-btn"
                    />
                  </div> : <div><input
                    onClick={() => {
                      browserHistory.push('/upload-photo');
                    }}
                    type="button"
                    className="btn"
                    value="Upload photo"
                    id="add-to-cart-btn"
                  /></div>}
                  {!_.isEmpty(this.props.photo) ? <input
                    onClick={() => {
                      this.props.dispatch(
                        saveCartItem(this.state.item, this.props.productId,
                          this.props.edits, this.state.qtyValue, this.state.item.price)
                      );
                      browserHistory.push('/cart');
                    }}
                    type="button"
                    className="btn"
                    value="Add To Cart"
                    id="add-to-cart-btn"
                  /> : null}
                  <p className="description" dangerouslySetInnerHTML={{ __html: this.state.product.description }}></p>
                </div>
              </div>
            </div>
          </div>
        </div>);
    }
    return null;
  }
}

ProductForm.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    products: state.products.list,
    items: state.products.items,
    projectItems: state.projects.items,
    quantity: state.projects.quantity,
    list: state.projects.list,
    multiPhoto: state.config.multiPhoto,
  };
}
export default connect(mapStateToProps)(ProductForm);
