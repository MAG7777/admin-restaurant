import { Alert, Col, Row } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { RouteMap } from './RouteMap';

export const CreateRouteMap = ({ name }) => {
  const { control } = useFormContext();
  const points = useWatch({ name: 'points', control });
  const pointsValue = points.reduce((acc, point) => {
    const coords =
      point.place?.address?.mapPosition || point?.address?.mapPosition;
    if (coords) {
      acc.push({
        coords,
        id: nanoid(),
        content: acc.length + 1,
      });
    }
    return acc;
  }, []);
  return (
    <div>
      <Row wrap={false} gutter={[20, 16]}>
        <Col xs={24}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RouteMap
                height={354}
                editMode
                polylineValue={field.value}
                pointsValue={pointsValue}
                onChange={field.onChange}
              />
            )}
          />
        </Col>
      </Row>
      <Alert
        style={{ marginTop: '24px' }}
        message='Метка встает автоматически от указанных мест в Точки маршрута'
        type='info'
        showIcon
      />
    </div>
  );
};
