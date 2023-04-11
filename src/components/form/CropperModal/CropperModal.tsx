import React from 'react';
import { Button, Modal, Row, Typography } from 'antd';
import ReactCropper from 'react-cropper';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { omit, pick } from 'utils/helpers';
import { useDeepEffect } from 'utils/useDeepEffect';
import yup from 'utils/yup';
import { getImageUrl } from 'utils/image';

import { InputField } from '../base/InputField';
import { TextAreaField } from '../base/TextAreaField';
import styles from './CropperModal.module.less';

type TRequestData = {
  crop: any;
  cropCanvas: any;
  source: string;
  author: string;
  description?: string;
};

type TProps = {
  value: {
    author: string;
    source: string;
    description?: string;
  };
  onChange: (value: any) => void;
  setCroppedImageUrl?: (value: string) => void;
  originalImageUrl: string;
  setCropModalIsOpen: (value: boolean) => void;
  cropModalIsOpen: boolean;
  aspectRatio?: any;
};

export const validationSchema = yup.object().shape({
  source: yup.string().required(),
  author: yup.string().required(),
  description: yup.string(),
});

export const CropperModal: React.FC<TProps> = ({
  value,
  onChange,
  setCroppedImageUrl,
  originalImageUrl,
  setCropModalIsOpen,
  cropModalIsOpen,
  aspectRatio,
}) => {
  const resolver = yupResolver(validationSchema);

  const methods = useForm({
    defaultValues: value,
    resolver,
  });

  const [cropper, setCropper] = React.useState(null);

  const submit = ({ description, author, source }) => {
    const data = pick(cropper.getData(true), 'x', 'y', 'width', 'height');
    const cropCanvas = cropper.getCroppedCanvas();
    const requestData: TRequestData = {
      ...omit(value, 'description'),
      crop: data,
      cropCanvas,
      source,
      author,
    };
    if (description?.length) {
      requestData.description = description;
    }
    onChange(requestData);
    if (typeof setCroppedImageUrl === 'function') {
      if ('path' in value) {
        setCroppedImageUrl(getImageUrl(requestData));
      } else {
        setCroppedImageUrl(cropCanvas.toDataURL());
      }
    }
    setCropModalIsOpen(false);
  };

  const handleCancel = () => {
    setCropModalIsOpen(false);
  };

  useDeepEffect(() => {
    methods.reset({
      author: value?.author,
      description: value?.description,
      source: value?.source,
    });
  }, [value]);

  return (
    <Modal
      title='Редактировать изображение'
      visible={cropModalIsOpen}
      onCancel={handleCancel}
      width={840}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={() => methods.handleSubmit(submit)()}
        >
          Применить
        </Button>,
      ]}
      destroyOnClose
    >
      <FormProvider {...methods}>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className='ant-form ant-form-vertical'
        >
          <Row>
            <div className={styles.inputs}>
              <InputField
                required
                label='Автор'
                name='author'
                placeholder='Введите имя автора'
                autoFocus
                showCount
                maxLength={255}
              />
              <InputField
                required
                label='Ссылка на источник'
                name='source'
                placeholder='Укажите ссылку на источник'
                showCount
                maxLength={255}
              />
              <TextAreaField
                label='Описание изображения'
                name='description'
                placeholder='Описание изображения'
                showCount
                maxLength={255}
                rows={10}
              />
            </div>
            <div className={styles.image}>
              <Typography.Text>Редактировать фотографию</Typography.Text>

              <div className={styles.image__in}>
                <div className={styles.image__wrapper}>
                  <ReactCropper
                    aspectRatio={aspectRatio || 3 / 2}
                    initialAspectRatio={aspectRatio || 3 / 2}
                    src={originalImageUrl}
                    style={{ height: '100%', width: '100%' }}
                    zoomTo={0.5}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive
                    checkOrientation={false}
                    onInitialized={instance => {
                      setCropper(instance);
                    }}
                    guides
                    checkCrossOrigin={false}
                  />
                </div>
              </div>
            </div>
          </Row>
        </form>
      </FormProvider>
    </Modal>
  );
};
