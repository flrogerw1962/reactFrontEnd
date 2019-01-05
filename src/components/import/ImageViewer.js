import React, { PropTypes } from 'react';

const toggleSelectPhoto = (index, updateSelectedPhotos, images) => {
  if (images[index] && typeof images[index] === 'object') {
    const imagesView = images;
    imagesView[index].isSelected = !imagesView[index].isSelected;
    const newPhotos = imagesView.map((data) => {
      if (!data.source) {
        return {
          isSelected: data.isSelected,
          photoUrl: data.images.standard_resolution.url,
        };
      }
      return {
        isSelected: data.isSelected,
        photoUrl: data.source,
      };
    });
    // eslint-disable-next-line
    // imagesView.forEach((image) => image.isSelected = false);
    updateSelectedPhotos(newPhotos[index]);
  }
};

const addPhotoToList = (images, updateSelectedPhotos) => {
  const imagesView = images;
  const newPhotos = imagesView.map((data) => {
    if (!data.source) {
      return {
        isSelected: data.isSelected,
        photoUrl: data.images.standard_resolution.url,
      };
    }
    return {
      isSelected: data.isSelected,
      photoUrl: data.source,
    };
  }).filter((image) => { return image.isSelected === true; });
  // eslint-disable-next-line
  imagesView.forEach((image) => image.isSelected = false);
  updateSelectedPhotos(newPhotos);
};

const propTypes = {
  images: PropTypes.array,
  updateSelectedPhotos: PropTypes.func,
  source: PropTypes.string,
  multiPhoto: PropTypes.bool,
};

const ImageViewer = ({ images, updateSelectedPhotos, source, multiPhoto }) => {
  if (source === 'instagram') {
    return (
      <div className="photoList__image-list">
        {multiPhoto ?
          <input
            type="button"
            value="Add photos selected"
            onClick={() => {
              addPhotoToList(images, updateSelectedPhotos);
            }}
            className="btn-primary add_to_list"
          /> : null}
        {images.map((photo, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundImage: `url(${photo.images.standard_resolution.url})`,
              }}
              className="photoList__image"
              onClick={() => {
                toggleSelectPhoto(index, updateSelectedPhotos, images);
              }}
            >{(photo.isSelected && multiPhoto) ? <div className="photopicker__image-selected" /> : null}
            </div>
          );
        })
      }
      </div>
      );
  }
  if (source === 'facebook') {
    return (
      <div className="photoList__image-list">
        {multiPhoto && images.length > 0 ?
          <input
            type="button"
            value="Add photos selected"
            onClick={() => {
              addPhotoToList(images, updateSelectedPhotos);
            }}
            className="btn-primary add_to_list"
          /> : null}
        {images.map((photo, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundImage: `url(${photo.source})`,
              }}
              className="photoList__image"
              onClick={() => {
                toggleSelectPhoto(index, updateSelectedPhotos, images);
              }}
            >{(photo.isSelected && multiPhoto) ? <div className="photopicker__image-selected" /> : null}
            </div>
          );
        })
      }
      </div>
    );
  }
  return null;
};


ImageViewer.propTypes = propTypes;

export default ImageViewer;
