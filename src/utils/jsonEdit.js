import _ from 'lodash';

export function getImgJSON(edit, imageData, container) {
  const imgWidth = imageData.naturalWidth;
  const imgHeight = imageData.naturalHeight;
  let result = {};
  if (typeof edit !== 'undefined') {
    result = {
      cropX: getPixToPerc(imgWidth, _.get(edit, 'cropper.x', 0)),
      cropY: getPixToPerc(imgHeight, _.get(edit, 'cropper.y', 0)),
      cropWidth: getPixToPerc(imgWidth, _.get(edit, 'cropper.width', 0)),
      cropHeight: getPixToPerc(imgHeight, _.get(edit, 'cropper.height', 0)),
      locationBucket: '',
      location: '',
      rotation: _.get(edit, 'cropper.rotate', 0),
      brightness: _.round(_.get(edit, 'brightness', 1) * 100) / 100,
      finalWidth: 0,
      finalHeight: 0,
      text: _.get(edit, 'text.value', null),
      textX: getPixToPerc(container.width, _.get(edit, 'text.x', 0) + 75),
      textY: getPixToPerc(container.height, _.get(edit, 'text.y', 0)),
      bandOn: _.get(edit, 'text.band', null),
      bandY: getPixToPerc(container.height, _.get(edit, 'text.y', 0)),
      bandHeight: getPixToPerc(imgHeight, 26),
      fontColor: `${_.get(edit, 'text.color', 'white') === 'white' ? '#FFFFFF' : '#000000'}`,
      ratio: _.get(edit, 'ratio', 0),
    };
  }
  return result;
}

export function getImgEdit(edit, imageData, container) {
  const imgWidth = imageData.naturalWidth;
  const imgHeight = imageData.naturalHeight;
  let result = {};
  if (typeof edit !== 'undefined') {
    result = {
      brightness: `${_.round(edit / 100)}`,
      ratio: edit.ratio,
      cropper: {
        x: `${getPercToPix(imgWidth, edit.cropX)}`,
        y: `${getPercToPix(imgHeight, edit.cropY)}`,
        width: `${getPercToPix(imgWidth, edit.cropWidth)}`,
        height: `${getPercToPix(imgHeight, edit.cropHeigth)}`,
        rotate: edit.rotation,
        scaleX: 1,
        scaleY: 1,
      },
      text: {
        x: `${getPercToPix(imgWidth, edit.textX) - (container.width / 2)}`,
        y: `${getPercToPix(imgHeight, edit.textY)}`,
        value: edit.text,
        color: `${edit.text.color === '#FFFFFF' ? 'white' : 'black'}`,
      },
    };
  }
  return result;
}

function getPixToPerc(quantity, amount) {
  return Math.floor((amount * 100) / quantity) / 100;
}

function getPercToPix(quantity, amount) {
  return Math.floor((quantity * amount) / 100) / 100;
}
