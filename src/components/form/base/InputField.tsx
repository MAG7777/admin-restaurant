import React, { FC } from 'react';
import { Form, Input, InputProps, FormItemProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

type IProps = FormItemProps &
  InputProps & { formItemStyle?: React.CSSProperties };

export const InputField: FC<IProps> = ({
  label = 'Название',
  required,
  name,
  type = 'text',
  noStyle = undefined,
  tooltip = undefined,
  extra = undefined,
  formItemStyle,
  ...props
}) => {
  const { control } = useFormContext();
  const handleChange = e => {
    if (type === 'days') {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (!value) {
        return value;
      }
      value = Number(value);
      if (value > 999) {
        return 999;
      }
      if (value < 0) {
        return 0;
      }
      return value;
    }
    if (type === 'number') {
      return e.target.value.replace(/[^0-9]/g, '');
    }
    if (type === 'price') {
      return Number(e.target.value.replace(/[^0-9]/g, '')) * 100;
    }
    return e.target.value;
  };
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          help={fieldState.error?.message}
          validateStatus={fieldState.error ? 'error' : 'success'}
          required={required}
          noStyle={noStyle}
          tooltip={tooltip}
          extra={extra}
          style={formItemStyle}
        >
          <Input
            {...field}
            {...props}
            type='text'
            value={
              type === 'price' && field.value
                ? Number(field.value) / 100
                : field.value
            }
            onChange={e => field.onChange(handleChange(e))}
            autoComplete={'chrome-off'}
            style={{
              ...(noStyle &&
                fieldState.error && {
                  borderColor: '#ff4d4f',
                  boxShadow: '0 0 0 2px rgb(255 77 79 / 20%)',
                }),
            }}
          />
        </Form.Item>
      )}
      control={control}
    />
  );
};
