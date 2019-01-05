import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { uploadPhoto } from '../actions/';
import autoBind from 'react-autobind';

import '../assets/stylesheets/_photopicker-modal.scss';

const propTypes = {
  dispatch: PropTypes.func,
  updateSelectedPhotos: PropTypes.func.isRequired,
  list: PropTypes.array,
};

class PhotoUploader extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
    };
    autoBind(this);
  }

  onDrop(files) {
    const newFile = this.state.files.concat(files);
    this.setState({
      files: newFile,
    });
    _.forEach(files, (file) => {
      this.props.dispatch(uploadPhoto(file));
    });
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }
  toggleSelectPhoto(index) {
    if (this.props.list[index] && typeof this.props.list[index] === 'object') {
      const newPhotos = this.props.list;
      newPhotos[index].isSelected = !newPhotos[index].isSelected;
      const photos = Array.filter(newPhotos, (item) => item.isSelected === true);
      this.props.updateSelectedPhotos(photos);
    }
  }

  renderPhotos() {
    if (this.props.list.length > 0) {
      return (
        <div className="photopicker__image-list">
        {this.props.list.map((img, index) => {
          return (
            <div
              key={index}
              style={{ backgroundImage: `url(${img.photoUrl})` }}
              className="photopicker__image"
              onClick={() => {
                this.toggleSelectPhoto(index);
              }}
            >{!!img.isSelected ? <div className="photopicker__image-selected" /> : null}
            </div>
          );
        })}
        </div>
        );
    }
    return null;
  }

  renderFileUploader() {
    if (this.props.list.length === 0) {
      return (
        <Dropzone ref="dropzone" onDrop={this.onDrop} className="photouploader">
          <div className="content">
            <i className="fa fa-camera"></i>
            <div className="photouploader__btn-container">
              <a className="btn">Pick Photos</a>
            </div>
          </div>
        </Dropzone>
        );
    }
    return (
      <Dropzone ref="dropzone" onDrop={this.onDrop} className="photouploader" />
    );
  }

  renderFooter() {
    return (
      <div className="modal__footer" >
        <a href="#" style={{ float: 'left' }} onClick={this.onOpenClick}>
          Add more
        </a>
      </div>
    );
  }

  render() {
    if (this.props.list.length === 0) {
      return (
        <div className="upload-photo">
          {this.renderFileUploader()}
          {this.renderPhotos()}
        </div>
      );
    }
    return (
      <div className="upload-photo">
        {this.renderFileUploader()}
        {this.renderPhotos()}
        {this.renderFooter()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    list: state.photos.list,
  };
}

PhotoUploader.propTypes = propTypes;

export default connect(mapStateToProps)(PhotoUploader);
