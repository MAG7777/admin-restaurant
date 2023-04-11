import React from 'react';
import { Button, Checkbox, Col, Row, Typography } from 'antd';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { DatePicker } from '../../base/DatePicker';
import { TimePickerField } from '../../base/TimePickerField';

type TSessionsErrors = {
  from?: {
    message: string;
  };
  to?: {
    message: string;
  };
};

export const PlaceSessions: React.FC<{ name: string }> = ({ name }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: name,
    control,
  });

  const onAddSession = () => {
    append({ date: null, from: null, to: null, fullDay: false });
  };

  return (
    <>
      {fields.map((item: any, index) => (
        <Controller
          key={item.id}
          name={`${name}.${index}`}
          control={control}
          defaultValue={item.value}
          render={({ field, fieldState }) => {
            const error = fieldState.error as TSessionsErrors;
            return (
              <Row gutter={[24, 0]}>
                <Col>
                  <DatePicker
                    name={`${field.name}.date`}
                    placeholder='Выберите дату'
                  />
                </Col>

                <Col key={item.value}>
                  <Row
                    key={index}
                    align='middle'
                    wrap={false}
                    style={{ gap: 14 }}
                  >
                    с
                    <TimePickerField
                      name={`${field.name}.from`}
                      width={100}
                      suffixIcon={null}
                      minuteStep={5}
                      disabled={field.value.fullDay}
                    />
                    до
                    <TimePickerField
                      name={`${field.name}.to`}
                      width={100}
                      suffixIcon={null}
                      minuteStep={5}
                      disabled={field.value.fullDay}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div>
                        <Typography.Text type='danger'>
                          {error?.from?.message}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type='danger'>
                          {!error?.from ? error?.to?.message : null}
                        </Typography.Text>
                      </div>
                    </div>
                  </Row>
                </Col>

                <Col style={{ marginBottom: 24 }}>
                  <Row align='middle' style={{ height: '100%' }}>
                    <Col span={6}>
                      <Checkbox
                        checked={field.value.fullDay}
                        disabled={field.value.from || field.value.to}
                        onChange={e =>
                          field.onChange({
                            ...field.value,
                            fullDay: e.target.checked,
                          })
                        }
                      >
                        Круглосуточно
                      </Checkbox>
                    </Col>
                  </Row>
                </Col>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                  style={{ marginLeft: 16, marginBottom: 24 }}
                />
              </Row>
            );
          }}
        />
      ))}

      <Row gutter={24}>
        <Button
          type='link'
          icon={<PlusCircleOutlined />}
          onClick={onAddSession}
        >
          Добавить сеанс
        </Button>
      </Row>
    </>
  );
};
