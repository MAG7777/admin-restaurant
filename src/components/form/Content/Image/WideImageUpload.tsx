import React from 'react';
import { Button } from 'antd';
import * as deepEqual from 'fast-deep-equal/es6/react';

import { Dropzone } from '../../Dropzone/Dropzone';
import { ImagePreview } from '../../ImagePreview/ImagePreview';
import styles from './WideImageUpload.module.less';

type TProps = {
  name: string;
  value: any;
  onChange: (value: any) => void;
  width: number;
  height: number;
  children: React.ReactNode;
};

export class WideImageUpload extends React.Component<TProps> {
  static defaultProps = {
    onChange: () => undefined,
    value: null,
    children: null,
    imageModifiers: null,
  };
  dropzone;

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !deepEqual.default(this.props, nextProps) ||
      !deepEqual.default(this.state, nextState)
    );
  }

  onUploadClick = () => {
    this.dropzone.open();
  };

  refDropzone = el => {
    this.dropzone = el;
  };

  render() {
    return (
      <Dropzone
        className={styles.dropzone}
        name={`${this.props.name}-dropzone`}
        onDrop={this.props.onChange}
        ref={this.refDropzone}
        disableClick
      >
        <div className={styles.image}>
          <ImagePreview
            value={this.props.value || '/public/images/gallery/preview.jpg'}
            width={this.props.width}
            height={this.props.height}
          />
        </div>

        <div className={styles.uploadArea}>
          <Button onClick={this.onUploadClick}>Загрузить фотографию</Button>
        </div>

        {this.props.children}
      </Dropzone>
    );
  }
}
