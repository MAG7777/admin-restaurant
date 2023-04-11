import { UPLOAD_SERVICE_BASE_URL } from 'constants/image';
import { urls } from 'store/api';

import { isEmpty, partition } from './helpers';
import { apiClient } from './http';

function imageFilesUpload(files) {
  if (isEmpty(files)) {
    return Promise.resolve([]);
  }

  const formData = new window.FormData();

  files.forEach(file => {
    formData.append('image', file);
  });

  return apiClient
    .post(urls.api.upload.image.post, formData)
    .then(res => res.data);
}

function audioFilesUpload(files) {
  if (isEmpty(files)) {
    return Promise.resolve([]);
  }

  const formData = new window.FormData();

  files.forEach(file => {
    formData.append('audio', file);
  });
  return apiClient.post(urls.api.upload.audio.post, formData).then(res => {
    const data = res.data;
    return {
      path: data.name,
      realName: data.realName,
      baseUrl: UPLOAD_SERVICE_BASE_URL,
    };
  });
}

export const uploadImage = (data, { fileLoader = imageFilesUpload } = {}) => {
  if (data && data.file) {
    const newData = { ...data };
    return fileLoader([newData.file]).then(res => {
      delete newData.file;

      return { ...newData, path: res.name, baseUrl: UPLOAD_SERVICE_BASE_URL };
    });
  } else {
    return Promise.resolve(data);
  }
};

export const uploadImageArray = (
  array,
  { fileLoader = imageFilesUpload } = {}
) => {
  if (!array || !Array.isArray(array)) {
    return Promise.resolve([]);
  }
  array = array.filter(i => i);
  if (!array.length) {
    return Promise.resolve([]);
  }

  const [newFiles, oldFiles] = partition(array, ({ file }) => file);

  return Promise.all(
    newFiles.map(item => {
      return fileLoader([item.file]);
    })
  ).then(uploadData =>
    oldFiles.concat(
      uploadData.map((item, index) => {
        delete newFiles[index].file;

        return {
          ...newFiles[index],
          path: item.name,
          baseUrl: UPLOAD_SERVICE_BASE_URL,
        };
      })
    )
  );
};

export const uploadContent = content => {
  const promises = content.map(async contentItem => {
    switch (contentItem.type) {
      case 'image':
        contentItem.image = await uploadImage(contentItem.image);
        return contentItem;
      case 'gallery':
        contentItem.gallery = await uploadImageArray(contentItem.gallery);
        return contentItem;
      case 'widget': {
        const { widget } = contentItem;

        if (widget.type !== 'manual') {
          return contentItem;
        }
        contentItem.widget.manual.image = await uploadImage(
          widget.manual.image
        );
        return contentItem;
      }
      default:
        return contentItem;
    }
  });

  return Promise.all(promises);
};

export const uploadAudio = (data, { fileLoader = audioFilesUpload } = {}) => {
  if (data && data.file?.originFileObj) {
    const newData = { ...data };
    return fileLoader([newData.file.originFileObj]).then(res => {
      return {
        ...res,
        baseUrl: UPLOAD_SERVICE_BASE_URL,
      };
    });
  } else {
    return Promise.reject('Ошибка при загрузке файла');
  }
};
