import React from 'react';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

type IProps = FormItemProps & InputProps;

export const PasswordField: React.FC<IProps> = ({
  label = 'Пароль',
  required,
  name,
  noStyle = undefined,
  tooltip = undefined,
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
          validateStatus={fieldState.error ? 'error' : 'success'}
          required={required}
          noStyle={noStyle}
          tooltip={tooltip}
        >
          <Input.Password
            {...field}
            {...props}
            onChange={e => field.onChange(e.target.value)}
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
