import { Form, FormItemProps } from 'antd';
import dayjs, { ConfigType } from 'dayjs';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  AntDatePicker,
  AntDatePickerProps,
} from '../antDateFields/AntDatePicker';
import { defaultDateFormat } from './RangePicker';

type IDatepickerProps = Omit<AntDatePickerProps, 'picker'> &
  FormItemProps & {
    name: string;
    maxDateRestriction?: number;
    minDateRestriction?: number;
  };

export const DatePicker: React.FC<IDatepickerProps> = ({
  label,
  maxDateRestriction,
  minDateRestriction,
  required,
  name,
  noStyle,
  extra,
  ...props
}) => {
  const { control } = useFormContext();

  const dateFormatList = [
    'DD.MM.YYYY',
    'D/M/YY',
    'D/M/YYYY',
    'D.M.YY',
    'D.M.YYYY',
  ];

  const disabledDate = React.useCallback(
    d => {
      if (d == null) {
        return null;
      }

      let maxDate = null;
      let minDate = null;

      if (maxDateRestriction) {
        maxDate = dayjs(maxDateRestriction);
      }

      if (minDateRestriction) {
        minDate = dayjs(minDateRestriction);
      }

      return (
        (minDate != null && d.isBefore(minDate) && !d.isSame(minDate, 'day')) ||
        (maxDate != null && d.isAfter(maxDate) && !d.isSame(maxDate, 'day'))
      );
    },
    [maxDateRestriction, minDateRestriction]
  );

  return (
    <Controller
      name={name}
      defaultValue={null}
      render={({ field, fieldState }) => {
        return (
          <Form.Item
            label={label}
            help={fieldState.error?.message}
            validateStatus={fieldState.error ? 'error' : 'success'}
            required={required}
            extra={extra}
            noStyle={noStyle}
          >
            <AntDatePicker
              {...field}
              {...props}
              picker='date'
              value={
                field.value
                  ? dayjs(field.value, defaultDateFormat)
                  : field.value
              }
              onChange={value =>
                field.onChange(
                  value
                    ? dayjs(value as ConfigType).format(defaultDateFormat)
                    : null
                )
              }
              format={dateFormatList}
              style={{ width: '100%' }}
              placeholder={props.placeholder || 'Выберите дату'}
              disabledDate={disabledDate}
            />
          </Form.Item>
        );
      }}
      control={control}
    />
  );
};
