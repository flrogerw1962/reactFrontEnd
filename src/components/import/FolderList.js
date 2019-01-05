import React, { PropTypes } from 'react';
import autoBind from 'react-autobind';
import ImageViewer from '../../components/import/ImageViewer';

const propTypes = {
  Item: PropTypes.object.isRequired,
  updateSelectedPhotos: PropTypes.func.isRequired,
};

class FolderList extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      openFolder: false,
      folderID: null,
    };
  }

  clickFolder(index) {
    this.setState({
      openFolder: true,
      folderID: index,
    });
  }

  backFolder() {
    this.setState({
      openFolder: false,
      folderID: null,
    });
  }

  render() {
    const styleButton = { color: 'black' };
    if (this.state.openFolder === false) {
      return (
        <div>
          <div
            className="fb-login-button"
            data-max-rows="1"
            data-size="medium"
            data-show-faces="true"
            data-auto-logout-link="true"
          >
          </div>
          <div className="folderList__image-list">
            {this.props.header}
            {this.props.folder.map((photo, index) => {
              return (
                <div
                  className="folderList__image folder"
                  key={index}
                >
                  <div
                    style={{
                      backgroundImage: `url(${photo.picture.data.url})`,
                    }}
                    className="front"
                    onClick={() => this.clickFolder(index)}
                  >{!!photo.isSelected ? <div className="photopicker__image-selected" /> : null}
                  </div>
                  <div
                    className="back"
                  >
                    <p>{photo.name}</p>
                  </div>
                </div>
              );
            })
          }
          </div>
        </div>
    );
    }
    return (
      <div>
        <ImageViewer
          images={this.props.folder[this.state.folderID].photos.data}
          updateSelectedPhotos={this.props.updateSelectedPhotos}
          source="facebook"
        />
        <input
          type="button"
          placeholder="Name"
          value="Back to folders"
          style={styleButton}
          onClick={() => this.backFolder()}
        />
      </div>
    );
  }
}

FolderList.propTypes = propTypes;

FolderList.propTypes = {
  folder: PropTypes.array,
  header: PropTypes.object,
};


export default FolderList;
