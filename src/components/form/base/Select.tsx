import React from 'react';
import { Form, FormItemProps, Select as AntSelect, SelectProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import { isNumber, isString } from 'utils/helpers';

export type ISelectFieldProps = SelectProps &
  Omit<FormItemProps, 'name'> & {
    name: string;
  };

export const Select: React.FC<ISelectFieldProps> = ({
  options,
  name,
  label,
  defaultValue,
  extra,
  required,
  ...props
}) => {
  const { control, getValues, setValue, reset } = useFormContext();
  React.useEffect(() => {
    const value = getValues(name);
    if (isString(value) || isNumber(value)) {
      if (props.mode && props.mode === 'multiple') {
        const ids = String(value).split(',');
        setValue(name, ids);
      }
    }
  }, []);

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          help={fieldState.error?.message}
          validateStatus={fieldState.error ? 'error' : 'success'}
          extra={extra}
          required={required}
        >
          <AntSelect
            {...field}
            {...props}
            onChange={(value, option) => {
              if (!value) {
                const newValue = value === undefined ? null : value;
                field.onChange(newValue);
                return;
              }
              if (props.mode === 'multiple') {
                field.onChange(option);
              } else {
                field.onChange(option);
              }
            }}
            onClear={() => {
              if (!props.onClear) {
                reset({
                  ...getValues(),
                  [name]: props.mode === 'multiple' ? [] : null,
                });
              } else {
                props.onClear();
              }
            }}
          >
            {options.map(item => {
              const { label, value, ...extraData } = item;
              return (
                <AntSelect.Option
                  key={value}
                  value={value}
                  extraData={extraData}
                >
                  {label}
                </AntSelect.Option>
              );
            })}
          </AntSelect>
        </Form.Item>
      )}
      control={control}
      defaultValue={defaultValue}
    />
  );
};
