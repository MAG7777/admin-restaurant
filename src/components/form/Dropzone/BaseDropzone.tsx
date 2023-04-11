import { nanoid } from 'nanoid';
import React from 'react';
import Dropzone from 'react-dropzone';

import { load } from 'utils/image';

export type TDropzoneProps = {
  name: string;
  allowedAttachmentMimeTypes: string[];
  maxSize: number;
  className?: string;
  multiple?: boolean;
  onDrop: (value: any) => void;
  onDropError?: (files: any) => void;
  children: React.ReactNode;
  disableClick?: boolean;
  style?: {
    [key: string]: string | number;
  };
  inputProps?: any;
};

export class BaseDropzone extends React.Component<TDropzoneProps> {
  static defaultProps = {
    className: '',
    multiple: false,
    onDrop: () => undefined,
    onDropError: () => undefined,
    disableClick: false,
    style: null,
    inputProps: {},
  };
  dropzone;

  onDrop = files => {
    const { onDrop, multiple } = this.props;

    Promise.all(files.map(file => load(file))).then(images => {
      files.forEach((file, index) => {
        file.id = `file_${nanoid()}`;
        file.image = images[index];
      });

      onDrop(multiple ? files : files[0]);
    });
  };

  refDropzone = el => {
    this.dropzone = el;
  };

  open() {
    this.dropzone.open();
  }

  render() {
    return (
      <Dropzone
        className={this.props.className}
        name={this.props.name}
        onDropAccepted={this.onDrop}
        onDropRejected={this.props.onDropError}
        multiple={this.props.multiple}
        disablePreview
        style={this.props.style}
        activeStyle={{}}
        rejectStyle={{}}
        ref={this.refDropzone}
        accept={this.props.allowedAttachmentMimeTypes.join(',')}
        maxSize={this.props.maxSize}
        disableClick={this.props.disableClick}
        inputProps={this.props.inputProps}
      >
        {this.props.children}
      </Dropzone>
    );
  }
}
