import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { getInstagramPhotos } from '../../actions/';
import ImageViewer from '../../components/import/ImageViewer';
import _ from 'lodash';


const propTypes = {
  appId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  photos: PropTypes.object,
  updateSelectedPhotos: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  multiPhoto: PropTypes.bool,
};

const authenticateInstagram = (instagramClientId, instagramRedirectUri, callback) => {
  // the access token is required to make any endpoint calls, http://instagram.com/developer/endpoints/
  let accessToken = null;
  const appId = instagramClientId;
  const redirectUri = instagramRedirectUri;
  const popupWidth = 700;
  const popupHeight = 500;
  const popupLeft = (window.screen.width - popupWidth) / 2;
  const popupTop = (window.screen.height - popupHeight) / 2;
  // eslint-disable-next-line max-len
  const popup = window.open(window.location.origin, '', `width=${popupWidth}`, `height=${popupHeight}`, `left=${popupLeft}`, `top=${popupTop}`);
  popup.onload = () => {
    if (window.location.hash.length === 0) {
       // eslint-disable-next-line max-len
      popup.open(`https://api.instagram.com/oauth/authorize/?client_id=${appId}&redirect_uri=${redirectUri}&response_type=token`, '_self');
    }
		// an interval runs to get the access token from the pop-up
    const interval = setInterval(() => {
      try {
        // check if hash exists
        if (popup.location.hash.length) {
          // hash found, that includes the access token
          clearInterval(interval);
          accessToken = popup.location.hash.slice(14);
          // slice #access_token= from string
          popup.close();
          if (callback !== undefined && typeof callback === 'function') callback(accessToken);
        }
        // eslint-disable-next-line max-len
        if (popup.location.search === '?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.') {
          clearInterval(interval);
          // alert('Permission denied by the user');
          popup.close();
          if (callback !== undefined && typeof callback === 'function') callback();
        }
      } catch (evt) {
        if (evt.code !== 18) {
          // permission denied
          alert('Permission denied by the user');
          clearInterval(interval);
          if (callback !== undefined && typeof callback === 'function') callback();
        }
      }
    }, 200);
  };
};

class InstagramImport extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      auth: localStorage.getItem('authTokenInstagram') || {},
    };
  }
  componentDidMount() {
    if (!_.isEmpty(this.state.auth) && this.props.photos.data.length === 0) {
      this.props.dispatch(getInstagramPhotos(this.state.auth));
    } if (_.isEmpty(this.state.auth)) {
      const appId = this.props.appId;
      const redirectUri = this.props.redirectUri;
      authenticateInstagram(appId, redirectUri, this.responseInstagram);
    }
  }
  responseInstagram(authToken) {
    localStorage.setItem('authTokenInstagram', authToken);
    if (this.props.photos.data.length === 0) {
      this.props.dispatch(getInstagramPhotos(authToken));
    } else {
      this.props.callback('Error');
    }
  }

  loadMore(photos) {
    const authToken = this.state.auth;
    const nextUrl = photos.pagination.next_url;
    this.props.dispatch(getInstagramPhotos(authToken, nextUrl));
  }

  render() {
    const { photos } = this.props;
    if (photos.data.length === 0) {
      return (
        <div className="instagram">
          <h2>Loading...</h2>
        </div>
      );
    }
    return (
      <div className="instagram">
        <ImageViewer
          images={photos.data}
          source="instagram"
          updateSelectedPhotos={this.props.updateSelectedPhotos}
          multiPhoto={this.props.multiPhoto}
        />
        {!_.isEmpty(photos.pagination) ?
          <input
            id="load"
            type="button"
            className="btn-primary"
            value="Show more Of My Instagram Photos"
            onClick={() => {
              this.loadMore(photos);
            }}
          /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    photos: state.photos.instagram,
    multiPhoto: state.config.multiPhoto,
  };
}

InstagramImport.propTypes = propTypes;

export default connect(mapStateToProps)(InstagramImport);
