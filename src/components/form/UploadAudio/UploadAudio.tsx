import React from 'react';
import { Form, FormItemProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import { BaseUploadAudio } from './BaseUploadAudio';

type IProps = Omit<FormItemProps, 'name'> & {
  name: string;
};

export const UploadAudio: React.FC<IProps> = ({ name, label, required }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={required}
          help={fieldState.error?.message}
          validateStatus={fieldState.error ? 'error' : 'success'}
        >
          <BaseUploadAudio
            onChange={imageValues => {
              field.onChange(imageValues);
            }}
            value={field.value}
          />
        </Form.Item>
      )}
      control={control}
    />
  );
};
