import _ from 'lodash';
import LZString from 'lz-string';

export function getThumbnail(e, edits, jsonResult) {
  const { textX, bandY } = jsonResult;
  const { brightness, text } = edits;
  const toDataURL = LZString.decompressFromUTF16(localStorage.getItem('imagePreview'));
  const myCan = document.createElement('canvas');
  myCan.id = 'myTempCanvas';
  const element = document.getElementsByClassName('imagePreview');
  const background = new Image();
  const img = new Image();
  let ele;
  let total = 0;
  let ready = true;
  let stop;
  const intervalIds = [];
  img.setAttribute('crossOrigin', 'anonymous');
  background.setAttribute('crossOrigin', 'anonymous');
  img.onload = () => {
    if (element.length === 1) {
      ele = element[0];
      background.src = ele.dataset.productImage;
      ready = false;
    } else {
      _.each(element, (elt, index) => {
        if (ready === true) {
          ele = elt;
          background.src = ele.dataset.productImage;
          ready = false;
        } else {
          stop = setInterval(() => {
            const ind = index;
            if (ready === true) {
              ele = elt;
              if (_.isEmpty(element[ind])) {
                _.each(intervalIds, (id) => {
                  clearInterval(id);
                });
              } else {
                background.src = element[ind].dataset.productImage;
                ready = false;
                total = total + 1;
                clearInterval(intervalIds[ind - 1]);
              }
            }
          }, 0);
          intervalIds.push(stop);
        }
      });
    }
  };
  background.onload = () => {
    if (myCan.getContext) {
      myCan.width = background.width;
      myCan.height = background.height;
      const cntxt = myCan.getContext('2d');
      // draw the image into the canvas
      // cntxt.rotate(-1 * Math.PI / 180);
      const { productImageX, productImageY, productImageWidth, productImageHeight } = ele.dataset;
      cntxt.drawImage(img, productImageX, productImageY, productImageWidth, productImageHeight);
      // set brightness of the image moving for each pixel and setting
      // a static value, this increase the brightness(using preview brightness choose by user).
      if (!_.isUndefined(brightness)) {
        const pixels = cntxt.getImageData(productImageX, productImageY, myCan.width, myCan.height);
        const d = pixels.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] += (brightness * 100) - 90;
          d[i + 1] += (brightness * 100) - 90;
          d[i + 2] += (brightness * 100) - 90;
        }
        cntxt.putImageData(pixels, productImageX, productImageY);
      }
      // set text and text-band
      if (text !== undefined) {
        if (text.value !== '') {
          const textXPosition = Math.floor((textX * productImageWidth) + Number(productImageX));
          const textYPosition = Math.floor((bandY * productImageHeight) + Number(productImageY));
          cntxt.save();
          // draw the band if apply
          if (text.band === true) {
            const bandYPosition = Math.floor((bandY * productImageHeight) + Number(productImageY));
            cntxt.globalAlpha = 0.5; // opacity
            cntxt.fillStyle = 'black';
            cntxt.fillRect(productImageX, bandYPosition, productImageWidth, 20);
          }
          // draw text
          cntxt.restore();
          cntxt.fillStyle = `${text.color}`;
          cntxt.font = '12px Marydale';
          cntxt.fillText(`${text.value}`, textXPosition, textYPosition + 15);
        }
      }
      cntxt.drawImage(background, 0, 0, myCan.width, myCan.height);
      const dataURL = myCan.toDataURL();
      cntxt.clearRect(0, 0, myCan.width, myCan.height);
      if (dataURL != null && dataURL !== undefined) {
        const nImg = document.createElement('img');
        nImg.src = dataURL;
        ele.src = nImg.src;
        background.src = '';
        ready = true;
      } else {
        // alert('unable to get context');
      }
    }
  };
  if (!_.isEmpty(toDataURL)) {
    img.src = toDataURL;
  } else {
    img.src = e.photoUrl;
  }
}
