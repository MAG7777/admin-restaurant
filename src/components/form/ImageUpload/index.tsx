import React from 'react';
import loadImage from 'blueimp-load-image';
import { Button, notification, Tooltip, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

import { isEmpty, isString } from 'utils/helpers';
import { getImageUrl, load } from 'utils/image';
import { MAX_IMAGE_FILE_SIZE } from 'constants/upload';
import { TImage } from 'types/image';

import { EditOverlay } from './components/EditOverlay';
import { CropperModal } from '../CropperModal/CropperModal';

type TProps = {
  value: TImage;
  onChange: (value: any) => void;
  onDrop: (value: any) => void;
  showError: boolean;
};

export const AntUpload: React.FC<TProps> = ({
  value,
  onChange,
  onDrop,
  showError,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('');
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string>('');
  const [cropModalIsOpen, setCropModalIsOpen] = React.useState(false);

  const uploadButtonRef = React.useRef(null);
  const width = 190;
  const height = 190;

  React.useEffect(() => {
    if (isEmpty(value)) {
      return null;
    }

    if (!isString(value)) {
      if ('file' in value) {
        setOriginalImageUrl(value.file.image.src);
        value = value.cropCanvas || value.file.image;
      } else {
        setOriginalImageUrl(getImageUrl(value));
        value = getImageUrl(value, width, height);
      }
    }

    if (isEmpty(value)) {
      return null;
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
    /**
     код выше отвечает за обрезку изображения, которое приходит с сервера
     **/
    setCroppedImageUrl(src);
  }, []);

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({
        message:
          'Неверный формат. Пожалуйста, выберите файл с расширением .png, .jpg или .jpeg',
      });
    }
    const isLt2M = file.size < MAX_IMAGE_FILE_SIZE;
    if (!isLt2M) {
      return;
    }
    onChange({
      author: '',
      description: '',
      source: '',
    });
    return isJpgOrPng && isLt2M;
  }

  const handleImageInfoChange = info => {
    onChange(info);
  };

  const handleFileChange = info => {
    const isLt2M = info.file.size < MAX_IMAGE_FILE_SIZE;
    if (!isLt2M) {
      return notification.error({
        message: 'Пожалуйста, выберите файл с размером не более 1 МБ',
      });
    }
    /**
     эта функция следит за input в Upload
     **/
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageUrl(reader.result as string);
      setCroppedImageUrl(reader.result as string);
      /**
       тут уже загруженные файлы можно передать переменной
       **/
    };
    const fileList = info.fileList.map(e => e.originFileObj);
    const multiple = false;
    Promise.all(fileList.map(file => load(file))).then(images => {
      fileList.forEach((file, index) => {
        /**
         ВНИМАНИЕ!!
         без id и image картинки не сохранятся потому любую загрузку изображений
         нужно проводить через такую конструкцию.
         тут мы в стандартный объект изображения добавляем id и image
         **/
        file.id = `file_${nanoid()}`;
        file.image = images[index];
      });
      /**
       загрузка изображений должна производится через функцию onDrop
       **/
      onDrop(multiple ? fileList : fileList[0]);
      /**
       тут я в итоговый объект, который пойдет в формик пушу файл
       **/
      onChange({
        file: fileList[0],
      });
    });

    reader.readAsDataURL(info.file.originFileObj);
    setLoading(false);
    setCroppedImageUrl(null);
    setCropModalIsOpen(true);
  };

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <PlusOutlined style={{ fontSize: '30px' }} />
      )}
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  );

  const dummyRequest = ({ onSuccess }: RcCustomRequestOptions) => {
    /**
     эта штука позволяет убрать отправку стандартного запроса в анте
     **/
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleRemoveIamge = () => {
    onChange({});
    setCroppedImageUrl('');
    setOriginalImageUrl('');
  };

  const showUploadError = showError;
  const getTooltipText = () => {
    if (showError && !originalImageUrl) {
      return 'Необходимо загрузить изображение';
    }
    if (showError && originalImageUrl) {
      return 'Заполните информацию об изображении';
    }
    if (!originalImageUrl) {
      return 'Загрузите файл';
    }
    return null;
  };
  return (
    <div data-error={showUploadError} className={'upload'}>
      <Upload
        accept={'image/*'}
        name='avatar'
        listType='picture-card'
        customRequest={dummyRequest}
        onChange={handleFileChange}
        showUploadList={false}
        beforeUpload={beforeUpload}
        fileList={[]}
      >
        <Tooltip placement='top' title={getTooltipText()}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {originalImageUrl ? (
              <>
                <EditOverlay
                  setCropModalIsOpen={setCropModalIsOpen}
                  removeImage={handleRemoveIamge}
                />
                <img
                  className={'__image'}
                  src={croppedImageUrl || originalImageUrl}
                  alt='avatar'
                  style={{ width: '100%', height: '102px' }}
                />
              </>
            ) : (
              uploadButton
            )}
          </div>
        </Tooltip>

        <Button
          type={'primary'}
          ref={uploadButtonRef}
          style={{ display: 'none' }}
          block
        >
          Загрузить
        </Button>
      </Upload>
      <CropperModal
        value={value}
        onChange={handleImageInfoChange}
        setCroppedImageUrl={setCroppedImageUrl}
        originalImageUrl={originalImageUrl}
        setCropModalIsOpen={setCropModalIsOpen}
        cropModalIsOpen={cropModalIsOpen}
      />
    </div>
  );
};
