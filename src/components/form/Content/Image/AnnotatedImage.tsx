import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { getImageUrl } from 'utils/image';
import { CropperModal } from 'components/form/CropperModal/CropperModal';

import { WideImageUpload } from './WideImageUpload';

type TProps = {
  name: string;
  value: any;
  onChange: (value: any) => void;
  width: number;
  height: number;
};

export class AnnotatedImage extends React.Component<TProps> {
  static defaultProps = {
    onChange: () => undefined,
    value: null,
  };

  state = {
    infoModalIsOpen: false,
    originalImageUrl: null,
    cropModalIsOpen: false,
    croppedImageUrl: null,
  };

  onImageChange = file => {
    this.props.onChange({ file });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        originalImageUrl: this.props.value?.file
          ? this.props.value?.file.image.src
          : getImageUrl(this.props.value),
      });
    }
  }

  componentDidMount() {
    this.setState({
      originalImageUrl: this.props.value?.file
        ? this.props.value?.file.image.src
        : getImageUrl(this.props.value),
    });
  }

  setCropModalIsOpen(status) {
    this.setState({
      cropModalIsOpen: status,
    });
  }

  setCroppedImageUrl(url) {
    this.setState({
      croppedImageUrl: url,
    });
  }

  render() {
    const { value, width, height } = this.props;
    return (
      <WideImageUpload
        {...this.props}
        onChange={this.onImageChange}
        value={value}
      >
        {Boolean(value) && (
          <React.Fragment>
            <Button
              onClick={() => {
                this.setCropModalIsOpen(true);
              }}
              shape='circle'
              style={{ position: 'absolute', top: '24px', left: '24px' }}
            >
              <EditOutlined />
            </Button>
            <CropperModal
              value={value}
              onChange={this.props.onChange}
              setCroppedImageUrl={this.setCroppedImageUrl.bind(this)}
              originalImageUrl={this.state.originalImageUrl}
              setCropModalIsOpen={this.setCropModalIsOpen.bind(this)}
              cropModalIsOpen={this.state.cropModalIsOpen}
              aspectRatio={width / height}
            />
          </React.Fragment>
        )}
      </WideImageUpload>
    );
  }
}
