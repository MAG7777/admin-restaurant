import React from 'react';
import classNames from 'classnames';
import { Button, notification, Tooltip } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

import editableList from 'hocs/editableList';
import {
  getImageUrl,
  getGalleryAverageColor,
  getPercentImageAspectRatio,
} from 'utils/image';
import { verifyFiles } from 'utils/files';
import { capitalize } from 'utils/string';
import { pluralize } from 'utils/pluralize';
import { isObject, omit, partition, removeEmptyValues } from 'utils/helpers';
import { ScrollAnchor } from 'components/form/ScrollAnchor';
import { ErrorTooltip } from 'components/form/ErrorTooltip';
import { TImage } from 'types/image';
import { MAX_GALLERY_COUNT } from 'constants/upload';

import { CropperModal } from '../../CropperModal/CropperModal';
import { ImagePreview } from '../../ImagePreview/ImagePreview';
import { Dropzone } from '../../Dropzone/Dropzone';
import { Slider } from '../../Slider/Slider';
import { GalleryCounter } from './GalleryCounter';
import styles from './Gallery.module.less';

const WIDTH = 770;
const HEIGHT = 402;

type TProps = {
  addItems: (files: any[]) => void;
  getItems: () => any[];
  removeAt: (index: number) => void;
  getItem: (index: number) => any;
  errorRef: React.RefObject<HTMLDivElement>;
  changeItem: (index: number, item: any, options?: any) => void;
  error: any;
  name: string;
  value: TImage[];
};

class FormContentInnerGallery extends React.Component<TProps> {
  state = {
    currentIndex: 0,
    cropModalIsOpen: false,
    originalImageUrl: null,
    croppedImageUrl: null,
    fileList: [],
  };
  slider;
  dropzone;

  onPrevClick = () => {
    this.slider.prev();
  };

  onNextClick = () => {
    this.slider.next();
  };

  onSliderChange = index => {
    this.setState({ currentIndex: index });
  };

  onReject = duplicateCount => {
    notification.warning({
      message: `${capitalize(
        pluralize('отфильтрован', duplicateCount)
      )} ${duplicateCount} ${pluralize('дубликат', duplicateCount)}`,
    });
  };

  onDropFiles = files => {
    const prevFiles = this.state.fileList;
    return verifyFiles(files, prevFiles).then(verificationResults => {
      if ([...files, ...prevFiles].length > MAX_GALLERY_COUNT) {
        notification.error({
          message: `Вы можете загрузить не более ${MAX_GALLERY_COUNT} фотографий в галерею`,
        });
        return;
      }
      const [verified, rejected] = partition(
        files,
        (file, index) => verificationResults[index]
      );

      if (rejected.length) {
        this.onReject(rejected.length);
      }
      this.props.addItems(verified.map(file => ({ file })));
      this.setState({
        fileList: [...prevFiles, ...verified.map(file => ({ file }))],
      });
      this.slider.goTo(this.props.getItems().length - 1);
    });
  };

  getGalleryError(errors, index) {
    const imageError =
      errors && errors[index] ? 'Заполните информацию об изображении' : null;
    return imageError || null;
  }

  onUploadClick = () => {
    this.dropzone.open();
  };

  onRemoveClick = () => {
    const items = this.props.getItems();
    const { currentIndex } = this.state;
    this.setState({
      currentIndex: Math.max(
        0,
        currentIndex === items.length - 1 ? items.length - 2 : currentIndex
      ),
    });

    this.props.removeAt(currentIndex);
  };

  refDropzone = el => {
    this.dropzone = el;
  };

  refSlider = el => {
    this.slider = el;
  };

  changeInfo(info, options = {}) {
    const { currentIndex } = this.state;
    const item = this.props.getItem(currentIndex);
    this.props.changeItem(
      currentIndex,
      removeEmptyValues({ ...item, ...info }),
      options
    );
  }

  renderImage = image => {
    return (
      <div
        key={image.id}
        className={classNames(styles.image, {
          [styles.imageError]: image?.error,
        })}
      >
        <Tooltip title={image?.error || ''}>
          <div className={styles.item}>
            <ImagePreview value={image} width={WIDTH} height={HEIGHT} />
          </div>
        </Tooltip>
      </div>
    );
  };

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
    const { currentIndex } = this.state;
    const galleryErrors = this.props.error;
    const images = this.props.getItems().map((item, index) => {
      item.error = this.getGalleryError(galleryErrors, index);
      return item;
    });
    const image = images[currentIndex];
    const averageColor = getGalleryAverageColor(images);
    const originalImageUrl = image?.file
      ? image?.file.image.src
      : getImageUrl(image);
    let toolTipErrorMessage;
    if (isObject(galleryErrors)) {
      toolTipErrorMessage = galleryErrors.message;
    }
    return (
      <div className='content_gallery' ref={this.props.errorRef} tabIndex={0}>
        <ScrollAnchor error={galleryErrors} />

        <div className={styles.gallery}>
          <Dropzone
            name='hidden-gallery'
            ref={this.refDropzone}
            className={styles.inner}
            multiple
            disableClick
            onDrop={this.onDropFiles}
            style={{
              paddingBottom: getPercentImageAspectRatio(WIDTH, HEIGHT) + '%',
              backgroundColor: averageColor,
            }}
          >
            {images.length > 0 && (
              <React.Fragment>
                <Slider
                  innerRef={this.refSlider}
                  items={images}
                  initialSlide={currentIndex}
                  renderItem={this.renderImage}
                  getItemKey={obj => {
                    return obj?.file?.['name'] || obj?.['name'];
                  }}
                  onChange={this.onSliderChange}
                  useSwipe
                />
                <Button
                  onClick={this.onRemoveClick}
                  shape='circle'
                  icon={<CloseOutlined />}
                  style={{ position: 'absolute', top: '24px', right: '24px' }}
                />
                <Button
                  onClick={() => {
                    this.setCropModalIsOpen(true);
                  }}
                  shape='circle'
                  icon={<EditOutlined />}
                  style={{ position: 'absolute', top: '24px', left: '24px' }}
                />
                <CropperModal
                  value={omit(image, ['id', 'error'])}
                  onChange={(item, options?: any) =>
                    this.props.changeItem(currentIndex, item, options)
                  }
                  setCroppedImageUrl={this.setCroppedImageUrl.bind(this)}
                  originalImageUrl={originalImageUrl}
                  setCropModalIsOpen={this.setCropModalIsOpen.bind(this)}
                  cropModalIsOpen={this.state.cropModalIsOpen}
                  aspectRatio={WIDTH / HEIGHT}
                />
              </React.Fragment>
            )}

            {images.length === 0 && (
              <img
                className={styles.preview}
                src='/public/images/gallery/preview.jpg'
                draggable='false'
                alt='preview'
              />
            )}

            <div className={styles.uploadArea}>
              <Button onClick={this.onUploadClick}>Загрузить фотографию</Button>
            </div>
          </Dropzone>

          {images.length > 1 && (
            <div style={{ marginTop: '12px' }}>
              <GalleryCounter
                slide={currentIndex + 1}
                slides={images.length}
                onPrevClick={this.onPrevClick}
                onNextClick={this.onNextClick}
              />
            </div>
          )}
        </div>

        <ErrorTooltip error={toolTipErrorMessage} />
      </div>
    );
  }
}

export default editableList(FormContentInnerGallery);
