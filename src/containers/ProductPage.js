import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { saveCartItem, updateCartItem, setExpressMode } from '../actions/';
import ProductForm from '../components/home/product/ProductForm';
import ProductListItem from '../components/home/product/ProductListItem';
import autoBind from 'react-autobind';
import { getThumbnail } from '../utils/thumbnailCreator';
import _ from 'lodash';


import '../assets/stylesheets/_product-page.scss';

const propTypes = {
  currentProject: PropTypes.object,
  products: PropTypes.array,
  items: PropTypes.array,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  photo: PropTypes.object,
  params: PropTypes.object,
  edits: PropTypes.object,
  jsonResult: PropTypes.object,
  projectItems: PropTypes.array,
};

class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    const { location, currentProject } = props;
    this.state = {
      isEditing: location && location.state && location.state.isEditing || currentProject || false,
      itemId: currentProject && currentProject.itemId || null,
      popLeft: 0,
      popTop: 0,
      projectName: '',
    };
    autoBind(this);
  }

  componentDidUpdate() {
    if (this.state.isEditing) {
      window.scrollTo(0, 0);
    }
  }

  saveCartItem() {
    // if there's a cartItemId, then it's an update.  This logic may
    // belong in index.js at the low-level and used also by cartPage
    const { currentProject } = this.props;
    delete currentProject.projectId;
    if (currentProject.cartItemId) {
      this.props.dispatch(updateCartItem(currentProject.cartItemId, {
        photoCustomization: currentProject.photoCustomization,
      }));
    } else {
      currentProject.quantity = 1;
      this.props.dispatch(saveCartItem(currentProject));
    }
    browserHistory.push('/cart');
  }

  renderProductList() {
    return this.props.products.map((product, index) => {
      const itemDefault = this.props.items.find((item) => item.id === product.defaultItemId);
      return (<ProductListItem product={product} item={itemDefault} key={index} />);
    });
  }
  renderProductForm(id) {
    return (
      <ProductForm
        productId={id}
        photo={this.props.photo}
        edits={this.props.edits}
        jsonResult={this.props.jsonResult}
        item={this.props.projectItems}
      />
    );
  }
  render() {
    if (!_.isEmpty(this.props.photo)) getThumbnail(this.props.photo, this.props.edits, this.props.jsonResult);
    if (this.props.params.id) {
      return this.renderProductForm(this.props.params.id);
    }
    return (
      <div className="products-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1>Let's go</h1>
              <span>
                Select any product below for your <strong>wall, desk or shelf</strong> and with a couple clicks your order will
                be at your doorstep within 3 business days. 100% Happiness Guaranteed.
                <br className="visible-sm-block visible-xs-block"></br>
                <br className="visible-sm-block visible-xs-block"></br>
                Want to try a different photo?
                <Link
                  to="/upload-photo"
                  onClick={() => {
                    this.props.dispatch(setExpressMode(true));
                  }}
                >
                Click here
                </Link>
              </span>
            </div>
          </div>
          <div className="row">
            {this.renderProductList()}
          </div>
        </div>
      </div>
      );
  }

}

ProductPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    products: state.products.list,
    items: state.products.items,
    photo: state.photos.photo,
    edits: state.projects.current.edits,
    jsonResult: state.projects.current.jsonResult,
    projectItems: state.projects.current.items,
  };
}

export default connect(mapStateToProps)(ProductPage);
