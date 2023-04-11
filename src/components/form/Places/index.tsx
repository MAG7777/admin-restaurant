import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Col, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import { PlaceContainer } from './components/PlaceContainer';
import { DateTableType, PlaceType } from './components/PlaceItemContent';
import { PlaceItemSelector } from './components/PlaceItemSelector';
import { LocationSelector } from '../AddressSelector/LocationSelector';

export const Places: React.FC<{ name: string }> = ({ name }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: name,
    control,
  });

  const handleSelectorChange = () => {
    append({ type: PlaceType.place, workTimeType: DateTableType.specific });
  };

  return (
    <Row gutter={[24, 0]}>
      {fields.length ? (
        <Col span={24}>
          {fields.map((item: any, index) => (
            <Controller
              key={item.id}
              name={`${name}.${index}`}
              control={control}
              defaultValue={item.value}
              render={({ field, fieldState }) => (
                <PlaceContainer
                  key={field.name}
                  number={index + 1}
                  handleClear={() => remove(index)}
                  error={fieldState.error}
                  {...field}
                >
                  {field.value.type === PlaceType.place ? (
                    <PlaceItemSelector name={field.name} />
                  ) : (
                    <div style={{ marginBottom: 24 }}>
                      <LocationSelector name={`${field.name}.address`} />
                    </div>
                  )}
                </PlaceContainer>
              )}
            />
          ))}
        </Col>
      ) : null}
      <Col span={24}>
        <Row gutter={[24, 0]} justify='end'>
          <Button
            type='link'
            icon={<PlusCircleOutlined />}
            onClick={handleSelectorChange}
            style={{ padding: '0 15px' }}
          >
            Добавить место
          </Button>
        </Row>
      </Col>
    </Row>
  );
};
