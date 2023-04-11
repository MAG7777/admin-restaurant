import React from 'react';
import { Form, DatePicker } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

const { RangePicker } = DatePicker;

interface IRangeDatePicker {
  name: string;
  label?: string;
  required?: boolean;
  dateFormat?: string;
  style?: React.CSSProperties;
}

export const defaultDateFormat = 'DD.MM.YYYY';

export const RangeDatePicker: React.FC<IRangeDatePicker> = ({
  name,
  label = 'Дата',
  required,
  dateFormat = defaultDateFormat,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={null}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          help={fieldState.error?.message}
          validateStatus={fieldState.error?.message ? 'error' : 'success'}
          required={required}
        >
          <RangePicker
            style={{ display: 'flex' }}
            {...field}
            {...props}
            onChange={time => {
              const newValue = time ? time : null;
              field.onChange(newValue);
            }}
            format={dateFormat}
          />
        </Form.Item>
      )}
      control={control}
    />
  );
};
