import React from 'react';
import { notification } from 'antd';

import { MAX_IMAGE_FILE_SIZE } from 'constants/upload';

import { BaseDropzone, TDropzoneProps } from './BaseDropzone';

interface IProps
  extends Omit<TDropzoneProps, 'allowedAttachmentMimeTypes' | 'maxSize'> {
  allowedAttachmentMimeTypes?: string[];
  maxSize?: number;
}
export const Dropzone = React.forwardRef((props: IProps, ref: any) => {
  const onDropError = files => {
    files.map(file => {
      notification.error({
        message: `У файла ${
          file.name || ''
        } недопустимый формат или слишком большой размер. Загрузите файл с расширением .png, .jpg или .jpeg и размером до 1 МБ`,
      });
    });
  };
  // const maxSize = props.maxSize || config.api.maxFileSize;
  const maxSize = props.maxSize || MAX_IMAGE_FILE_SIZE;
  // const allowedAttachmentMimeTypes = props.allowedAttachmentMimeTypes || _(config.api.allowedAttachmentMimeTypes)
  const allowedAttachmentMimeTypes = props.allowedAttachmentMimeTypes || [
    'image/jpeg',
    'image/png',
  ];
  return (
    <BaseDropzone
      {...props}
      onDropError={onDropError}
      ref={ref}
      maxSize={maxSize}
      allowedAttachmentMimeTypes={allowedAttachmentMimeTypes}
    />
  );
});

Dropzone.displayName = 'Dropzone';
