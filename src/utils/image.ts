import loadImage from 'blueimp-load-image';

import { isEmpty, isString } from './helpers';

export const scale = function (file, width, height) {
  return loadImage.scale(file, {
    maxWidth: width,
    minWidth: width,
    maxHeight: height,
    minHeight: height,
    canvas: true,
    crop: true,
    downsamplingRatio: 0.5,
  });
};

export const load = function (
  file,
  options = {
    canvas: false,
    noRevoke: true,
    meta: false,
  }
) {
  return new Promise((resolve, reject) => {
    loadImage(
      file,
      image => {
        if (image.type === 'error') {
          reject(image);
        } else {
          resolve(image);
        }
      },
      options
    );
  });
};

const fileNameRegExp = /(.*?)(\..*)?$/;

/*
  With only `file` just return original image.
  If `isFullView` is true then return resized image with original ratio
  else return cropped image with specified width and height.
*/
export const getImageUrl = (file, ...args) => {
  const [width, height, isFullView] = args;

  if (!file || isEmpty(file)) {
    return file;
  }
  const fileName = file.path || file;

  if (!isString(fileName)) {
    return;
  }

  const baseUrl = file.baseUrl;

  const [, path, extension] = fileNameRegExp.exec(fileName);

  let url = `${baseUrl}/${path}`;
  const { crop } = file;

  if (crop) {
    url += `/-/extract/${crop.x}x${crop.y}x${crop.width}x${crop.height}`;
  }

  if (!isFullView && width && height) {
    url += `/-/resize/${width}x${height}/`;
  }

  return url + (extension || '');
};

export const getPercentImageAspectRatio = (width, height) =>
  (height / width) * 100;

export const getGalleryAverageColor = gallery => {
  const firstLoaded = gallery.find(image => image.averageColor);
  return firstLoaded ? '#' + firstLoaded.averageColor : '';
};
