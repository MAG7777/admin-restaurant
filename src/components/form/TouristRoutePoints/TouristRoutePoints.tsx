import { PlusOutlined } from '@ant-design/icons';
import { Button, Row, Space } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { prepareContent } from '../Content/utils';
import { ManualPoint } from './components/ManualPoint';
import { PlacePoint } from './components/PlacePoint';
import { PointLayout } from './components/PointLayout';

const pointsHash = {
  place: PlacePoint,
  manual: ManualPoint,
};

const pointsNamesHash = {
  place: 'Место',
  manual: 'Геометка',
};
export const TouristRoutePoints = ({ name }) => {
  const { control } = useFormContext();
  const value = useWatch({ name, control });
  const { fields, append, move, remove } = useFieldArray({
    name: name,
    control,
  });

  const changePosFn = (prevIndex, nextIndex) => {
    move(prevIndex, nextIndex);
  };

  const removePointFn = index => {
    remove(index);
  };

  return (
    <div>
      {fields.length > 0 && (
        <Row>
          {fields.map((item: any, index) => (
            <Controller
              key={item.id}
              name={`${name}.${index}`}
              control={control}
              render={({ field, fieldState }) => {
                const Component = pointsHash[field.value.type];
                const fieldValue = value[index];
                const initialIsOpen = !(fieldValue?.type === 'place'
                  ? fieldValue?.place
                  : fieldValue?.routeName);
                return (
                  <PointLayout
                    initialIsOpen={initialIsOpen}
                    key={item.id}
                    mainTitle={fieldValue?.place?.name || fieldValue?.routeName}
                    subTitle={pointsNamesHash[item.type]}
                    index={index}
                    total={fields.length}
                    changePosFn={changePosFn}
                    removePointFn={removePointFn}
                    error={fieldState.error}
                    {...field}
                  >
                    <Component name={field.name} value={field.value} />
                  </PointLayout>
                );
              }}
            />
          ))}
        </Row>
      )}
      <Row style={{ padding: '24px' }}>
        <Space size='small'>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              append({
                id: nanoid(),
                type: 'place',
                description: prepareContent([]),
                place: null,
                duration: '',
                audio: null,
              });
            }}
          >
            Место
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              append({
                id: nanoid(),
                type: 'manual',
                description: prepareContent([]),
                address: {
                  region: null,
                },
                routeName: '',
                shortDescription: '',
                image: null,
                duration: '',
                audio: null,
              });
            }}
          >
            Геометка
          </Button>
        </Space>
      </Row>
    </div>
  );
};
