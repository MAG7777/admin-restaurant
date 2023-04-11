import React from 'react';
import classNames from 'classnames';
import { Form, FormItemProps, Typography } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import { AntUpload } from '../ImageUpload';

type IProps = Omit<FormItemProps, 'name'> & {
  name: string;
};

export const MainImage: React.FC<IProps> = ({ name, label, required }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        return (
          <div
            className={classNames('main-image image-uploader__images', {
              'image-uploader__error': fieldState.error,
            })}
            ref={field.ref}
            tabIndex={0}
          >
            <div>
              <Form.Item
                label={label}
                required={required}
                tooltip={
                  <div>
                    <Typography.Text className='white_text' strong>
                      Требования к фото:
                    </Typography.Text>
                    <ul>
                      <li>максимальный размер - 1 МБ</li>
                      <li>расширение - .png, .jpg, .jpeg</li>
                    </ul>
                  </div>
                }
              >
                <AntUpload
                  showError={Boolean(fieldState.error)}
                  onChange={imageValues => {
                    field.onChange(imageValues);
                  }}
                  onDrop={file => field.onChange({ file })}
                  value={field.value}
                />
              </Form.Item>
            </div>
          </div>
        );
      }}
      control={control}
    />
  );
};
