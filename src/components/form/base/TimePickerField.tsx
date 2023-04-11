import React from 'react';
import { Form, FormItemProps } from 'antd';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { omit } from 'utils/helpers';

import { AntTimePicker, TimePickerProps } from '../antDateFields/AntTimePicker';

type TProps = TimePickerProps &
  Omit<FormItemProps, 'name'> & {
    name: string;
    width?: number;
    label?: string;
  };

export const TimePickerField: React.FC<TProps> = ({
  name,
  tooltip = '',
  width,
  label = '',
  required,
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        return (
          <Form.Item
            validateStatus={fieldState.error ? 'error' : 'success'}
            tooltip={tooltip}
            style={{ marginBottom: label ? '24px' : 0 }}
            label={label}
            required={required}
          >
            <AntTimePicker
              {...props}
              {...omit(field, 'onChange')}
              showNow={false}
              onSelect={time => {
                return field.onChange(dayjs(time).diff(dayjs().startOf('day')));
              }}
              onChange={time => {
                const newValue = time
                  ? dayjs(time).diff(dayjs().startOf('day'))
                  : null;
                field.onChange(newValue);
              }}
              format='HH:mm'
              placeholder='00:00'
              data-name={name}
              value={
                field.value
                  ? dayjs(dayjs().startOf('day').valueOf() + field.value)
                  : null
              }
              style={{ width: width ? width : '100%' }}
            />
          </Form.Item>
        );
      }}
      control={control}
    />
  );
};
