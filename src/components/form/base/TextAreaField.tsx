import React from 'react';
import { Form, FormItemProps, Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { TextAreaProps } from 'antd/lib/input';

type IProps = FormItemProps & TextAreaProps;

export const TextAreaField: React.FC<IProps> = ({
  label = 'Описание',
  name,
  required,
  rows = 4,
  tooltip = undefined,
  extra = undefined,
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          help={fieldState.error?.message}
          validateStatus={fieldState.invalid ? 'error' : 'success'}
          required={required}
          tooltip={tooltip}
          extra={extra}
        >
          <Input.TextArea
            {...field}
            {...props}
            autoComplete={'chrome-off'}
            rows={rows}
          />
        </Form.Item>
      )}
      control={control}
    />
  );
};
