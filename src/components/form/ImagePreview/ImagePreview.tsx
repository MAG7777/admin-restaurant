import React from 'react';
import loadImage from 'blueimp-load-image';
import * as deepEqual from 'fast-deep-equal/es6/react';

import { getPercentImageAspectRatio, getImageUrl } from 'utils/image';
import { isEmpty, isString } from 'utils/helpers';

import styles from './ImagePreview.module.less';

type TProps = {
  width: number;
  height: number;
  value: any;
  className: string;
};

export class ImagePreview extends React.Component<TProps> {
  static defaultProps = {
    className: '',
    value: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !deepEqual.default(this.props, nextProps) ||
      !deepEqual.default(this.state, nextState)
    );
  }

  render() {
    const { width, height } = this.props;
    let { value } = this.props;

    if (isEmpty(value)) {
      return null;
    }

    if (!isString(value)) {
      value =
        (value.file && (value.cropCanvas || value.file.image)) ||
        getImageUrl(value, width, height);
    }

    const src = isString(value)
      ? value
      : loadImage
          .scale(value, {
            maxWidth: width,
            minWidth: width,
            maxHeight: height,
            minHeight: height,
            canvas: true,
            crop: true,
            downsamplingRatio: 0.5,
          })
          .toDataURL();
    return (
      <div
        className={styles.wrapper}
        style={{
          paddingBottom: getPercentImageAspectRatio(width, height) + '%',
        }}
      >
        <img
          className={styles.image}
          src={src}
          draggable='false'
          alt='preview'
        />
      </div>
    );
  }
}
