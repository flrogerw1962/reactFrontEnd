import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import autoBind from 'react-autobind';
import FacebookLogin from '../../components/import/FacebookImport';
import InstagramLogin from '../../components/import/InstagramImport';
import { addPhotoToList, setSelectedPhoto, uploadPhoto, addPhotoToProject, uploadPhotoSuccess } from '../../actions/';
import '../../../node_modules/rc-slider/assets/index.css';
import '../../assets/stylesheets/_photo-editing-bay.scss';
import '../../../node_modules/cropperjs/dist/cropper.css';
import '../../assets/stylesheets/_photopicker-modal.scss';
import _ from 'lodash';
import { browserHistory } from 'react-router';

const imgDevice = require('../../assets/images/my_device.png');
const imgFacebook = require('../../assets/images/facebook.png');
const imgInstagram = require('../../assets/images/instagram.png');

const propTypes = {
  dispatch: PropTypes.func,
  uploaded: PropTypes.bool,
  items: PropTypes.array,
  multiPhoto: PropTypes.bool,
  express: PropTypes.bool,
};


class PhotoPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selector: '',
      selectedPhoto: {},
      loading: false,
    };
    autoBind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.uploaded === true && nextState.loading === true) {
      if (!_.isEmpty(this.props.items)) {
        const { productId } = this.props.items.find((itm) => { return itm.name === 'Size'; });
        browserHistory.push(`/products/${productId}`);
      } else {
        browserHistory.push('/products');
      }
    }
  }

  onDrop(files) {
    _.forEach(files, (file) => {
      this.props.dispatch(uploadPhotoSuccess(false));
      this.props.dispatch(uploadPhoto(file));
    });
    this.setState({
      loading: true,
    });
    localStorage.setItem('imagePreview', null);
  }

  addPhotosTo(selectedPhoto) {
    if (this.props.multiPhoto === false) {
      this.props.dispatch(setSelectedPhoto(selectedPhoto));
      this.props.dispatch(addPhotoToProject(selectedPhoto.photoUrl));
      localStorage.setItem('imagePreview', null);
      if (!this.props.express && !_.isEmpty(this.props.items)) {
        const { productId } = this.props.items.find((itm) => { return itm.name === 'Size'; });
        browserHistory.push(`/products/${productId}`);
      } else {
        browserHistory.push('/products');
      }
    } else {
      if (!_.isArray(selectedPhoto)) {
        this.props.dispatch(setSelectedPhoto(selectedPhoto));
      } else {
        selectedPhoto.forEach((item) => {
          this.props.dispatch(addPhotoToList(item.photoUrl));
        });
        const { productId } = this.props.items.find((itm) => { return itm.name === 'Size'; });
        browserHistory.push(`/products/${productId}`);
      }
    }
  }

  render() {
    const uploading = this.state.loading ?
      <div>
        <div className="editing-bay-blackout"></div>
        <div className="editing-bay-blackout-container">Uploading....</div>
      </div>
       : '';
    if (this.state.selector === 'facebook') {
      return (
        <div className="image-viewer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <i
                  className="fa fa-arrow-left"
                  style={{ fontSize: '30px', paddingTop: '10px', cursor: 'pointer' }}
                  aria-hidden="true"
                  onClick={() => {
                    this.setState({
                      selector: '',
                    });
                  }}
                >
                </i>
              </div>
            </div>
            <div className="row">
              <div className="title-selector">
                <img
                  src={imgFacebook} alt="instagram logo" height="60px" width="60px"
                  style={{
                    display: 'block',
                    margin: 'auto',
                  }}
                />
                <h2>choose one photo</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <FacebookLogin
                  appId="1746573408915809"
                  autoLoad
                  fields="albums.fields(photos.fields(source),name,picture)"
                  callback={() => {
                  }}
                  cssClass="my-facebook-button-class"
                  icon="fa-facebook"
                  updateSelectedPhotos={(selectedFacebook) => {
                    this.addPhotosTo(selectedFacebook);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.selector === 'instagram' && typeof window !== 'undefined') {
      const redirectUri = window.location.origin;
      return (
        <div className="image-viewer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <i
                  className="fa fa-arrow-left"
                  style={{ fontSize: '30px', paddingTop: '10px', cursor: 'pointer' }}
                  aria-hidden="true"
                  onClick={() => {
                    this.setState({
                      selector: '',
                    });
                  }}
                >
                </i>
              </div>
            </div>
            <div className="row">
              <div className="title-selector">
                <img
                  src={imgInstagram} alt="instagram logo" height="60px" width="60px"
                  style={{
                    display: 'block',
                    margin: 'auto',
                  }}
                />
                <h2>choose one photo</h2>
              </div>
            </div>
            <div className="row">
              <InstagramLogin
                appId="5499be2b39604d7aa38a22a6b917b955"
                callback={(data) => {
                  if (data) {
                    this.setState({
                      selector: '',
                    });
                  }
                }}
                redirectUri={redirectUri}
                updateSelectedPhotos={(selectedInstagram) => {
                  this.addPhotosTo(selectedInstagram);
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="corkboard">
        <div className="container">
          <div className="row title-section">
            <div className="col-xs-12 intro">
              <h2>Select Your Photo</h2>
              <h4>Upload your photo from the options below. It's crazy easy and crazy fast!</h4>
            </div>
          </div>
          <div className="row selector">
            <div className="col-xs-4 select_icon">
              <a
                href="#"
              >
                <Dropzone ref="dropzone" onDrop={this.onDrop} className="photouploader">
                  <img src={imgDevice} alt="my device" height="65" width="65" />
                </Dropzone>
              </a>
              <p className="title">Phone/Tablet</p>
            </div>
            <div className="col-xs-4 select_icon">
              <a
                href="#"
                onClick={() => {
                  this.setState({
                    selector: 'facebook',
                  });
                }}
              >
                <img src={imgFacebook} alt="my device" height="65" width="65" />
              </a>
              <p className="title">Facebook</p>
            </div>
            <div className="col-xs-4 select_icon">
              <a
                href="#"
                onClick={() => {
                  this.setState({
                    selector: 'instagram',
                  });
                }}
              >
                <img src={imgInstagram} alt="my device" height="65" width="65" />
              </a>
              <p className="title">Instagram</p>
            </div>
          </div>
          <div className="row">
            <p className="tip">We recommend choosing a photo directly from your phone.
              You can also upload from Facebook or Instagram, but photos uploaded
            from your phone will turn out better - we promise.</p>
          </div>
        </div>
        {uploading}
      </div>
      );
  }
}
function mapStateToProps(state) {
  return {
    product: state.product,
    photo: state.photos.photo,
    uploaded: state.photos.uploaded,
    multiPhoto: state.config.multiPhoto,
    express: state.config.express,
    items: state.projects.items,
  };
}

PhotoPicker.propTypes = propTypes;

export default connect(mapStateToProps)(PhotoPicker);
