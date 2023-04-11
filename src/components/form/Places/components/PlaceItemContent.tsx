import React from 'react';
import { Form, Radio } from 'antd';
import { useFormContext, useWatch } from 'react-hook-form';

import { omit } from 'utils/helpers';

import { PlaceSessions } from './PlaceSessions';
import { PlaceSchedule } from './PlaceSchedule';
import { checkDisabledFields, defaultScheduleDump } from './formUtils';
import { onChangeValueType } from './PlaceContainer';

interface IPlaceItemContentProps {
  name: string;
  onChange: (value: onChangeValueType) => void;
  children: React.ReactNode;
  error: any;
}

export enum DateTableType {
  specific = 'specific',
  schedule = 'schedule',
}

export enum PlaceType {
  place = 'place',
  address = 'address',
}

export const PlaceItemContent: React.FC<IPlaceItemContentProps> = ({
  name,
  onChange,
  children,
  error,
}) => {
  const { control } = useFormContext();
  const value = useWatch({ name, control });

  const {
    isAddressDisabled,
    isPlaceDisabled,
    isSessionsDisabled,
    isClearButtonVisible,
    isScheduleDisabled,
  } = checkDisabledFields(value);

  const onChangePlaceType = (type: PlaceType) => {
    onChange({
      type,
      workTimeType: DateTableType.specific,
      ...(type === PlaceType.address && {
        address: {},
      }),
    });
  };

  const onChangeTimeType = (type: DateTableType) => {
    onChange({
      ...omit(value, 'sessions'),
      workTimeType: type,
      schedule: JSON.parse(JSON.stringify(defaultScheduleDump)),
    });
  };

  return (
    <>
      <Radio.Group
        defaultValue={value.type}
        onChange={e => onChangePlaceType(e.target.value)}
        style={{ marginBottom: 24 }}
      >
        <Radio.Button
          value={PlaceType.place}
          disabled={
            isPlaceDisabled || value.address?.region || value.address?.comment
          }
        >
          Место
        </Radio.Button>
        <Radio.Button
          value={PlaceType.address}
          disabled={isAddressDisabled || value.placeType}
        >
          Адрес
        </Radio.Button>
      </Radio.Group>
      {children}
      <Form.Item
        label='Сеансы'
        help={error?.sessions?.message}
        validateStatus={error?.sessions?.message ? 'error' : 'success'}
        required
      >
        <Radio.Group
          value={value.workTimeType}
          onChange={e => onChangeTimeType(e.target.value)}
          style={{ fontWeight: 'normal', marginTop: 24 }}
        >
          <Radio.Button
            value={DateTableType.specific}
            disabled={isSessionsDisabled}
          >
            В указанные дни
          </Radio.Button>
          <Radio.Button
            value={DateTableType.schedule}
            disabled={isScheduleDisabled}
          >
            По расписанию
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      {value.workTimeType === DateTableType.specific && (
        <PlaceSessions name={`${name}.sessions`} />
      )}
      {value.workTimeType === DateTableType.schedule && (
        <PlaceSchedule
          name={`${name}.schedule`}
          isClearButtonVisible={isClearButtonVisible}
          error={error}
        />
      )}
    </>
  );
};
