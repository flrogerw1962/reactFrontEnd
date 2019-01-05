import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PhotoPicker from '../components/editor/PhotoPicker';
import Draggable from 'react-draggable';
import Slider from 'rc-slider';
import autoBind from 'react-autobind';
import _ from 'lodash';
import '../../node_modules/rc-slider/assets/index.css';
import '../assets/stylesheets/_photo-editing-bay.scss';
import '../../node_modules/cropperjs/dist/cropper.css';
import { getImgJSON } from '../utils/jsonEdit';
import { addEditToProject, saveCartItem } from '../actions/';
import LZString from 'lz-string';

const isClient = typeof window !== 'undefined';
const Cropper = isClient ? require('react-cropper').default : undefined;

const propTypes = {
  current: PropTypes.object,
  onStart: PropTypes.func,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  photo: PropTypes.object,
  items: PropTypes.array,
  currentItem: PropTypes.array,
  quantity: PropTypes.number,
  list: PropTypes.array,
  selectedPhotoId: PropTypes.number,
  multiPhoto: PropTypes.bool,
};

class PhotoEditingBay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: '',
      height: 280,
      action: '',
      autoCrop: false,
      cropResult: null,
      notDraggable: false,
      text: {
        value: '',
        color: 'white',
        band: true,
        x: 0,
        y: 180,
      },
      brightness: 1,
      brightnessMax: 1.9,
      brightnessMin: 0.1,
      list: [],
    };
    this.lastData = {};
    autoBind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const cropper = this.cropper;
    if (typeof cropper !== 'undefined') {
      let cropperSettings;
      if (this.props.multiPhoto && !_.isEmpty(this.props.list)) {
        cropperSettings = this.props.list[this.props.selectedPhotoId].edits;
      } else {
        cropperSettings = this.props.current.edits;
      }
      if (this.state.orientation !== prevState.orientation) {
        cropper.cropper.build();

        const data = cropper.getData();

        if (cropperSettings.cropper) {
          cropperSettings.cropper.width = data.width;
          cropperSettings.cropper.height = data.height;
          cropper.setData(cropperSettings.cropper);
        }
        cropper.zoom(cropperSettings.ratio);
      }
      if (cropper !== null) {
        const result = getImgJSON(cropperSettings, cropper.getImageData(), cropper.getContainerData());
        this.setPropPhoto('jsonResult', result);
        this.setPropPhoto('canvasData', cropper.getCanvasData());
        const image = LZString.compressToUTF16(cropper.getCroppedCanvas().toDataURL());
        localStorage.setItem('imagePreview', image);
        console.log(JSON.stringify(result));
      }
    }

    this.renderDesignTools();
  }

  setPortrait() {
    if (this.state.orientation !== 'portrait') {
      this.setPropPhoto('edits.orientation', 'portrait');
      this.setState({ orientation: 'portrait', height: 330 });
    }
  }

  setLandscape() {
    if (this.state.orientation !== 'landscape') {
      this.setPropPhoto('edits.orientation', 'landscape');
      this.setState({ orientation: 'landscape', height: 230 });
    }
  }

  setBanner(band) {
    const input = document.getElementById('banner-input');
    const text = this.state.text;

    this.setPropPhoto('edits.text.band', band);
    text.band = band;

    if (band) {
      text.x = 0;
      this.setPropPhoto('edits.text.x', text.x);
    }

    if (band || !input.value) {
      input.style.width = '100%';
      input.style.left = null;
    } else {
      input.style.width = '165px';
    }

    this.setState({ text });
  }

  setFontColor(color) {
    const text = this.state.text;

    this.setPropPhoto('edits.text.color', color);
    text.color = color;

    this.setState({ text });
  }

  setPropPhoto(path, value) {
    if (this.props.multiPhoto && !_.isEmpty(this.props.list)) {
      _.set(this.props.list[this.props.selectedPhotoId], path, value);
    } else {
      _.set(this.props.current, path, value);
    }
  }

  getTextBanner() {
    const input = document.getElementById('banner-input');
    const value = input.value;
    const text = this.state.text;

    text.value = value;

    if (value.length > 0 && !text.band) {
      input.style.width = '165px';
      input.style.left = '';
    } else {
      input.style.width = '100%';
    }

    if ((input.clientWidth + text.x > 100) &&
        text.value.length < 24 &&
        !text.band &&
        (input.style.width !== '100%')) {
      text.x = text.x;
    }

    this.setState({ text });
  }

  getTextWidth(text) {
    const xsSize = 4;
    const xsChars = text.match(/[ilI!|;:’,. ]/g);
    const xsmallSize = xsChars ? (xsChars.length * xsSize) : 0;

    const sSize = 6;
    const sChars = text.match(/[abfnñoprstuxy1`^*(\-\[\]\\}"\/]/g);
    const smallSize = sChars ? (sChars.length * sSize) : 0;

    const mSize = 10;
    const mChars = text.match(/[cdehkmqvwz2-90A-FHJKLNÑOPRSTUVXY~@#$%&)_=+{'<>?]/g);
    const midSize = mChars ? (mChars.length * mSize) : 0;

    const lSize = 13;
    const lChars = text.match(/[gjGMQWZ]/g);
    const largeSize = lChars ? (lChars.length * lSize) : 0;

    return `${xsmallSize + smallSize + midSize + largeSize}px`;
  }

  saveTextBanner() {
    const value = _.trim(document.getElementById('banner-input').value);
    const text = this.state.text;
    this.setPropPhoto('edits.text.value', value);
    text.value = value;

    this.setState({ text });
  }

  toggleRotate() {
    let state = {
      action: '',
      autoCrop: false,
    };

    this.unmountDesignContainer();

    if (this.state.action !== 'showRotate') {
      state = {
        action: 'showRotate',
        autoCrop: true,
      };
    }

    this.setState(state);
  }

  toggleCrop() {
    let state = {
      action: '',
      autoCrop: false,
    };

    this.unmountDesignContainer();

    if (this.state.action !== 'showCrop') {
      state = {
        action: 'showCrop',
        autoCrop: true,
      };
    }

    this.setState(state);
  }

  toggleText() {
    const state = {
      action: '',
      autoCrop: false,
      notDraggable: true,
    };

    this.unmountDesignContainer();

    if (this.state.action !== 'showText') {
      state.action = 'showText';
      state.notDraggable = false;
    }
    if (this.props.current.edits.text !== undefined) {
      if (this.props.current.edits.text.band !== false) {
        this.setPropPhoto('edits.text.band', true);
        this.setPropPhoto('edits.text.color', 'white');
      }
    }
    this.setState(state);
  }

  toggleBrightness() {
    let state = {
      action: '',
    };

    if (this.state.action !== 'showBrightness') {
      this.renderBrightness();
      state = {
        action: 'showBrightness',
      };
    } else {
      this.unmountDesignContainer();
    }
    this.setState(state);
  }

  crop() {
    const detail = this.cropper.getData();
    if (this.state.autoCrop) {
      this.setPropPhoto('edits.cropper', detail);
    }
    this.setPropPhoto('edits.cropper.rotate', detail.rotate);
    this.setPropPhoto('canvasData', this.cropper.getCanvasData());
    this.props.dispatch(addEditToProject(detail, this.props.current.jsonResult));
  }

  readyCrop() {
    if (this.props.multiPhoto && !_.isEmpty(this.props.list)) {
      this.lastData = _.cloneDeep(this.props.list[this.props.selectedPhotoId]);
      this.cropper.setCanvasData(this.props.list[this.props.selectedPhotoId].canvasData);
      this.cropper.setData(this.props.list[this.props.selectedPhotoId].edits.cropper);
      this.adjustBrightness(this.props.list[this.props.selectedPhotoId].edits.brightness);
      if (this.props.list[this.props.selectedPhotoId].edits.text) {
        const { x, y, value, band, color } = this.props.list[this.props.selectedPhotoId].edits.text;
        if (this.props.list[this.props.selectedPhotoId].edits.text) {
          this.setState({
            text: {
              x,
              y,
              value,
              band,
              color,
            },
            notDraggable: true,
          });
        }
        if (!_.isEmpty(value)) {
          const banner = document.getElementById('text-banner');
          banner.style.width = '100%';
          ReactDOM.render(
            <span>{value}</span>,
            banner
          );
        }
      }
    } else {
      this.lastData = _.cloneDeep(this.props.current);
      this.lastImg = LZString.decompressFromUTF16(localStorage.getItem('imagePreview')) || null;
      this.cropper.setCanvasData(this.props.current.canvasData);
      this.cropper.setData(this.props.current.edits.cropper);
      this.adjustBrightness(this.props.current.edits.brightness);
      if (this.props.current.edits.text) {
        const { x, y, value, band, color } = this.props.current.edits.text;
        if (this.props.current.edits.text) {
          this.setState({
            text: {
              x,
              y,
              value,
              band,
              color,
            },
            notDraggable: true,
          });
        }
        if (!_.isEmpty(value)) {
          const banner = document.getElementById('text-banner');
          banner.style.width = '100%';
          ReactDOM.render(
            <span>{value}</span>,
            banner
          );
        }
      }
    }
    if (!this.state.autoCrop) {
      this.cropper.disable();
    }
  }

  zoom() {
    return this.state.autoCrop;
  }

  zoomCrop(zoomSize) {
    this.cropper.zoom(zoomSize);

    let ratio = this.props.current.edits.ratio;
    if (!_.isNumber(ratio)) {
      ratio = 0;
    }
    ratio = ratio + zoomSize;
    this.setPropPhoto('edits.ratio', ratio);
  }

  dragStopHandler(event, data) {
    const text = this.state.text;
    this.setPropPhoto('edits.text.x', data.x);
    this.setPropPhoto('edits.text.y', data.y);

    text.x = data.x;
    text.y = data.y;

    this.setState({ text });
  }

  dragDragHandler(event) {
    event.preventDefault();
  }

  adjustBrightness(brightnessValue) {
    if (brightnessValue >= this.state.brightnessMin && brightnessValue <= this.state.brightnessMax) {
      this.setState({
        brightness: brightnessValue,
      });

      let brightness = _.get(this.props.current.edits, 'brightness');
      const filterValue = `brightness(${brightnessValue})`;
      const image = document.querySelector('.cropper-view-box img');
      image.style.filter = filterValue;
      image.style['-webkit-filter'] = filterValue;
      image.style['-moz-filter'] = filterValue;
      image.style['-o-filter'] = filterValue;
      image.style['-ms-filter'] = filterValue;

      if (!_.isNumber(brightness)) {
        brightness = 0;
      }
      brightness = brightness + brightnessValue;
      this.setPropPhoto('edits.brightness', brightnessValue);
    }
  }

  moveUpBrigthness() {
    const brightnessValue = _.round(this.state.brightness + 0.1, 1);
    ReactDOM.unmountComponentAtNode(document.getElementById('design-container-left'));
    this.adjustBrightness(brightnessValue);
    this.renderBrightnessSlider(brightnessValue);
  }

  moveDownBrigthness() {
    const brightnessValue = _.round(this.state.brightness - 0.1, 1);
    ReactDOM.unmountComponentAtNode(document.getElementById('design-container-left'));
    this.adjustBrightness(brightnessValue);
    this.renderBrightnessSlider(brightnessValue);
  }

  unmountDesignContainer() {
    const left = document.getElementById('design-container-left');
    const right = document.getElementById('design-container-right');
    const banner = document.getElementById('text-banner');

    const text = _.trim(this.state.text.value);

    if (_.isEmpty(text)) {
      ReactDOM.unmountComponentAtNode(banner);
    } else {
      ReactDOM.render(
        <input value={text}></input>,
        // <span>{text}</span>,
        banner
      );
      this.setState({ notDraggable: true });
    }

    ReactDOM.unmountComponentAtNode(left);
    ReactDOM.unmountComponentAtNode(right);
  }

  renderBrightnessSlider(defaultValue) {
    const left = document.getElementById('design-container-left');
    ReactDOM.render(
      <div className="design-actions">
        <Slider
          min={this.state.brightnessMin}
          max={this.state.brightnessMax}
          step={0.1}
          defaultValue={defaultValue}
          vertical
          onChange={(value) => {
            this.adjustBrightness(value);
          }}
          tipFormatter={(value) => {
            return `${_.round(value * 100)}%`;
          }}
        />
        <label className="brightness-label">
          {_.round(this.state.brightness * 100)}%
        </label>
      </div>,
      left
    );
  }

  renderZoom() {
    const left = document.getElementById('design-container-left');
    const right = document.getElementById('design-container-right');

    ReactDOM.render(
      <div className="design-actions">
        <span className="fa-stack fa-lg design-button" onClick={() => { this.zoomCrop(-0.1); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-search-minus fa-stack-1x fa-inverse"></i>
        </span>
      </div>,
      left
    );

    ReactDOM.render(
      <div className="design-actions">
        <span className="fa-stack fa-lg design-button" onClick={() => { this.zoomCrop(0.1); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-search-plus fa-stack-1x fa-inverse"></i>
        </span>
      </div>,
      right
    );
  }

  renderRotate() {
    const left = document.getElementById('design-container-left');
    const right = document.getElementById('design-container-right');

    ReactDOM.render(
      <div className="design-actions">
        <span className="fa-stack fa-lg design-button" onClick={this.setPortrait}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-picture-o fa-stack-1x fa-inverse rotate-icon"></i>
        </span>
        <span className="fa-stack fa-lg design-button" onClick={this.setLandscape}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-picture-o fa-stack-1x fa-inverse"></i>
        </span>
      </div>,
      left
    );

    ReactDOM.render(
      <div className="design-actions">
        <span className="fa-stack fa-lg design-button" onClick={() => { this.cropper.rotate(90); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-repeat fa-stack-1x fa-inverse"></i>
        </span>
        <span className="fa-stack fa-lg design-button" onClick={() => { this.cropper.rotate(-90); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-undo fa-stack-1x fa-inverse"></i>
        </span>
      </div>,
      right
    );
  }

  renderText(current) {
    const left = document.getElementById('design-container-left');
    const right = document.getElementById('design-container-right');
    const banner = document.getElementById('text-banner');
    const text = this.state.text;

    let style = {};

    if (text.value && !text.band) {
      style = { width: '165px' };
    } else {
      style = { width: '100%' };
    }

    ReactDOM.render(
      <input
        id="banner-input"
        ref={bannerInput => { this.bannerInput = bannerInput; }}
        type="text"
        maxLength={24}
        style={style}
        value={text.value}
        placeholder="Add your text"
        onChange={this.getTextBanner}
        onBlur={this.saveTextBanner}
      />,
      banner
    );
    if (!current) {
      ReactDOM.render(
        <div className="design-actions">
          <span className="design-title">Font</span>
          <span className="fa-stack fa-lg design-button" onClick={() => { this.setFontColor('white'); }}>
            <i className={`fa fa-circle fa-stack-2x fa-inverse ${this.state.text.color === 'white' ? 'active' : ''}`} ></i>
            <i className="fa fa-stack-1x"></i>
          </span>
          <span className="fa-stack fa-lg design-button" onClick={() => { this.setFontColor('black'); }}>
            <i className={`fa fa-circle fa-stack-2x ${this.state.text.color === 'black' ? 'active' : ''}`} ></i>
            <i className="fa fa-stack-1x"></i>
          </span>
        </div>,
        left
      );

      ReactDOM.render(
        <div className="design-actions">
          <span className="design-title">Banner</span>
          <span className="fa-stack fa-lg design-button" onClick={() => { this.setBanner(true); }}>
            <i className={`fa fa-circle fa-stack-2x fa-inverse ${this.state.text.band ? 'active' : ''}`}></i>
            <i className="fa fa-stack-1x"><span className="text">On</span></i>
          </span>
          <span className="fa-stack fa-lg design-button" onClick={() => { this.setBanner(false); }}>
            <i className={`fa fa-circle fa-stack-2x fa-inverse ${!this.state.text.band ? 'active' : ''}`}></i>
            <i className="fa fa-stack-1x"><span className="text">Off</span></i>
          </span>
        </div>,
        right
      );
    }
  }

  renderBrightness() {
    const right = document.getElementById('design-container-right');

    this.renderBrightnessSlider(1);

    ReactDOM.render(
      <div className="design-actions">
        <span className="fa-stack fa-lg design-button" onClick={() => { this.moveUpBrigthness(); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-sun-o fa-stack-1x fa-inverse"></i>
        </span>
        <span className="fa-stack fa-lg design-button" onClick={() => { this.moveDownBrigthness(); }}>
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-moon-o fa-stack-1x fa-inverse"></i>
        </span>
      </div>,
      right
    );
  }

  renderDesignTools() {
    const renderAction = {
      showText: this.renderText,
      showRotate: this.renderRotate,
      showCrop: this.renderZoom,
      showBrightness: this.renderBrightness,
    };

    if (!!this.state.action) {
      renderAction[this.state.action]();
    }
  }

  renderCropper(photoUrl, style) {
    if (typeof window === 'undefined') { return (<div></div>); }
    return (
      <Cropper
        className="cropper-bay"
        ref={cropper => { this.cropper = cropper; }}
        style={style}
        autoCropArea={1}
        viewMode={3}
        background={false}
        src={photoUrl}
        crop={this.crop}
        zoom={this.zoom}
        zoomOnWheel={false}
        guides={false}
        center={false}
        restore={false}
        modal={false}
        highlight={false}
        cropBoxResizable={false}
        enable={this.state.autoCrop}
        ready={this.readyCrop}
        toggleDragModeOnDblclick={false}
        crossOrigin="anonymous"
      />
    );
  }

  renderProject() {
    const style = { height: this.state.height, width: '100%' };
    const orientationClasses = `editing-photo__goprint ${this.state.orientation}`;
    const designClasses = `editing-bay__design-container ${this.state.orientation}`;
    const bannerClasses = `text-banner ${this.state.text.band ? 'full' : ''} ${this.state.text.color}`;
    let photoUrl = this.props.current.photoUrl;
    if (this.props.multiPhoto && !_.isEmpty(this.props.list)) {
      photoUrl = this.props.list[this.props.selectedPhotoId].photoUrl;
    }
    if (_.isEmpty(photoUrl)) photoUrl = '';
    return (
      <div className="editing-bay__main-photo">
        <div id="design-container-left" className={designClasses}></div>
        <div className={orientationClasses}>
          <Draggable
            bounds={this.state.text.band ? 'parent' : { left: -65, right: 60, top: 10, bottom: 250 }}
            disabled={this.state.notDraggable}
            onStop={this.dragStopHandler}
            onDrag={this.dragDragHandler}
            // defaultPosition={{ x: 0, y: 0 }}
            position={{ x: this.state.text.x, y: this.state.text.y }}
            axis={this.state.text.band ? 'y' : 'both'}
          >
            <div id="text-banner" className={bannerClasses} ></div>
          </Draggable>
          {this.renderCropper(photoUrl, style)}
        </div>
        <div id="design-container-right" className={designClasses}></div>
      </div>
    );
  }

  renderDesignToolsActions() {
    const action = this.state.action;

    return (
      <div className="design-tools">
        <div className={`design-tools__button ${(action === 'showCrop' ? 'active' : '')}`} onClick={this.toggleCrop}>
          <i className="fa fa-crop fa-3x" aria-hidden="true"></i>
          <div className="design-tools__text">
            Crop
          </div>
        </div>
        <div className={`design-tools__button ${(action === 'showBrightness' ? 'active' : '')}`} onClick={this.toggleBrightness}>
          <i className="fa fa-sun-o fa-3x" aria-hidden="true"></i>
          <div className="design-tools__text">
            Brightness
          </div>
        </div>
        <div className={`design-tools__button ${(action === 'showRotate' ? 'active' : '')}`} onClick={this.toggleRotate}>
          <i className="fa fa-repeat fa-3x"></i>
          <div className="design-tools__text">
            Orientation
          </div>
        </div>
        <div className={`design-tools__button ${(action === 'showText' ? 'active' : '')}`} onClick={this.toggleText}>
          <i className="fa fa-font fa-3x" aria-hidden="true"></i>
          <div className="design-tools__text">
            Text
          </div>
        </div>
      </div>
      );
  }

  render() {
    if (this.props.location.pathname === '/customize' && this.props.current.photoUrl) {
      return (
        <div>
          <div className="image-editor">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                {this.renderProject()}
              </div>
              <div className="col-lg-1 col-md-1 col-sm-12">
                {this.renderDesignToolsActions()}
              </div>
              <div className="col-lg-5 col-md-5 col-sm-12">
                <div className="editor-buttons">
                  <input
                    onClick={() => {
                      this.setPropPhoto('canvasData', this.lastData.canvasData);
                      this.setPropPhoto('edits.cropper', this.lastData.edits.cropper);
                      this.setPropPhoto('edits.brightness', this.lastData.edits.brightness);
                      if (this.lastData.edits.text !== undefined) {
                        this.setPropPhoto('edits.text.band', this.lastData.edits.text.band);
                        this.setPropPhoto('edits.text.value', this.lastData.edits.text.value);
                        this.setPropPhoto('edits.text.color', this.lastData.edits.text.color);
                        this.setPropPhoto('edits.text.x', this.lastData.edits.text.x);
                        this.setPropPhoto('edits.text.y', this.lastData.edits.text.y);
                      }
                      localStorage.setItem('imagePreview', this.lastImg);
                      browserHistory.go(-1);
                    }}
                    type="button"
                    className="btn"
                    value="Cancel"
                    id="add-to-cart-btn"
                  />
                  <input
                    onClick={() => {
                      const image = LZString.compressToUTF16(this.cropper.getCroppedCanvas().toDataURL());
                      localStorage.setItem('imagePreview', image);
                      browserHistory.go(-1);
                    }}
                    type="button"
                    className="btn"
                    value="Preview"
                    id="add-to-cart-btn"
                  />
                  {!this.props.multiPhoto ? <input
                    onClick={() => {
                      const { id, productId } = _.head(this.props.currentItem);
                      const item = this.props.items.find((itm) => { return itm.id === id; });
                      // eslint-disable-next-line max-len
                      this.props.dispatch(saveCartItem(item, productId, this.props.current.edits, this.props.quantity, item.price));
                      browserHistory.push('/cart');
                    }}
                    type="button"
                    className="btn"
                    value="Add To Cart"
                    id="add-to-cart-btn"
                  /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <PhotoPicker
        dispatch={this.props.dispatch}
      />
      );
  }
}

function mapStateToProps(state) {
  return {
    current: state.projects.current,
    items: state.products.items,
    currentItem: state.projects.items,
    quantity: state.projects.quantity,
    list: state.projects.list,
    selectedPhotoId: state.projects.selectedPhotoId,
    multiPhoto: state.config.multiPhoto,
  };
}

PhotoEditingBay.propTypes = propTypes;

export default connect(mapStateToProps)(PhotoEditingBay);
