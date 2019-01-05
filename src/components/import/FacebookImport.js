import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { fetchFacebookImages, fetchMoreFacebookImages } from '../../actions/';
import ImageViewer from '../../components/import/ImageViewer';
import _ from 'lodash';


const propTypes = {
  callback: PropTypes.func.isRequired,
  appId: PropTypes.string.isRequired,
  xfbml: PropTypes.bool,
  cookie: PropTypes.bool,
  scope: PropTypes.string,
  textButton: PropTypes.string,
  typeButton: PropTypes.string,
  autoLoad: PropTypes.bool,
  size: PropTypes.string,
  fields: PropTypes.string,
  cssClass: PropTypes.string,
  version: PropTypes.string,
  icon: PropTypes.string,
  language: PropTypes.string,
  field: PropTypes.string,
  dispatch: PropTypes.func,
  login: PropTypes.bool,
  albums: PropTypes.array,
  photos: PropTypes.array,
  updateSelectedPhotos: PropTypes.func.isRequired,
  multiPhoto: PropTypes.bool,
};

const defaultProps = {
  textButton: 'Login with Facebook',
  typeButton: 'button',
  scope: 'public_profile,email,user_photos',
  xfbml: false,
  cookie: true,
  size: 'metro',
  field: 'name',
  cssClass: 'kep-login-facebook',
  version: '2.8',
  language: 'en_US',
  fields: 'albums.fields(photos.fields(source),name,picture)',
  login: false,
};

class FacebookLogin extends React.Component {

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      loading: true,
      folderID: '',
      notLogged: false,
    };
  }

  componentDidMount() {
    const { appId, xfbml, cookie, version, autoLoad, language } = this.props;
    const fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';

    document.body.appendChild(fbRoot);

    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });

      if (autoLoad) {
        window.FB.getLoginStatus(this.checkLoginState);
      }
    };

    // Load the SDK asynchronously
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    if (!_.isEmpty(window.FB)) {
      window.FB.getLoginStatus(this.checkLoginState);
    }
  }


  setLoading(load, albums) {
    if (albums) {
      this.setState({
        albums,
        loading: load,
      });
    } else {
      this.setState({
        loading: load,
      });
    }
  }

  getPhotos() {
    window.FB.api('/me', { fields: this.props.fields }, (result) => {
      this.props.dispatch(fetchFacebookImages(result.albums.data));
      this.setLoading(false);
    });
  }

  checkLoginState(response) {
    if (response.authResponse) {
      this.getPhotos();
      this.setState({ notLogged: false });
    } else {
      if (this.props.callback) {
        this.props.callback({ status: response.status });
        if (response.status === 'unknown' || response.status === 'not_authorized') this.load();
      }
    }
  }

  load() {
    const { scope, appId } = this.props;
    if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
      window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${appId}&
      redirect_uri=${window.location.href}&state=facebookdirect&${scope}`;
    } else {
      this.setState({ notLogged: true });
    }
  }

  loadMore(photos) {
    const folderID = this.state.folderID;
    const url = photos.paging.next;
    this.props.dispatch(fetchMoreFacebookImages(url, folderID));
  }

  renderComponent(albums, photos) {
    const loading = this.state.loading === true ? 'Loading facebook images please wait...' : '';
    let images = {
      photos: [],
    };
    if (!_.isEmpty(photos)) {
      images = {
        photos: photos.data,
        pagination: photos.paging,
      };
    }
    const list =
      albums.map((album) => {
        return (
          <option
            key={album.id}
            value={album.id}
          >{album.name}
          </option>
        );
      });
    if (this.state.notLogged) {
      return (
        <div className="facebook">
          <input
            type="button"
            id="facebook"
            onClick={() => {
              const { scope } = this.props;
              window.FB.login(this.checkLoginState, { scope });
            }}
            value="Please login with Facebook"
          >
          </input>
        </div>
      );
    }
    if (this.state.loading === true) {
      return (
        <div className="facebook">
          <p>{loading}</p>
        </div>

      );
    }
    if (this.state.notLogged === true) {
      return (
        <div
          className="fb-login-button"
          data-max-rows="1"
          data-size="medium"
          data-show-faces="false"
          data-auto-logout-link="false"
        >
        </div>);
    }
    return (
      <div className="title-selector facebook">
        <select
          onChange={(event) => {
            this.setState({
              folderID: event.target.value,
            });
          }}
        >
          <option value="origin">
            Select Album
          </option>
        {list}
        </select>
        <ImageViewer
          images={images.photos}
          source="facebook"
          updateSelectedPhotos={this.props.updateSelectedPhotos}
          multiPhoto={this.props.multiPhoto}
        />
        {!_.isEmpty(photos.paging) && photos.paging.next ?
          <input
            id="load"
            type="button"
            className="btn-primary"
            value="Show more Of My Facebook Photos"
            onClick={() => {
              this.loadMore(photos);
            }}
          /> : null}
      </div>
    );
  }

  render() {
    const { albums } = this.props;
    const { folderID } = this.state;
    let photos = [];
    const result = Array.filter(albums, (album) => {
      if (album.id === folderID) { return album.photos; }
      return false;
    });
    if (!_.isEmpty(result)) {
      photos = result[0].photos;
    }
    return this.renderComponent(albums, photos);
  }
}

FacebookLogin.propTypes = propTypes;
FacebookLogin.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    albums: state.photos.facebook,
    multiPhoto: state.config.multiPhoto,
  };
}

export default connect(mapStateToProps)(FacebookLogin);
