import React from 'react';
import { Button, Col, Form, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useFormContext } from 'react-hook-form';

import { Schedule } from '../../Schedule/Schedule';
import { RangeDatePicker } from '../../base/RangePicker';
import { defaultScheduleDump } from './formUtils';

interface IPlaceScheduleProps {
  name: string;
  isClearButtonVisible: boolean;
  error?: any;
}

export const PlaceSchedule: React.FC<IPlaceScheduleProps> = ({
  name,
  isClearButtonVisible,
  error,
}) => {
  const { setValue } = useFormContext();
  return (
    <Form.Item
      help={error?.schedule?.table?.message}
      validateStatus={error?.schedule?.table ? 'error' : 'success'}
      style={{ marginBottom: 0 }}
    >
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <RangeDatePicker
            name={`${name}.date`}
            label='Даты проведения'
            style={{ fontWeight: 'bold' }}
          />
        </Col>
        <Col span={24}>
          <Schedule name={`${name}.table`} withoutComment withAllTimeButton />
          {isClearButtonVisible && (
            <Button
              type='link'
              danger
              icon={<DeleteOutlined />}
              onClick={() => setValue(name, defaultScheduleDump)}
              style={{ marginTop: 24, padding: 0 }}
            >
              Очистить все
            </Button>
          )}
        </Col>
      </Row>
    </Form.Item>
  );
};
