import React from 'react';
import { Checkbox, Col, Form, Row } from 'antd';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputField } from '../base/InputField';

export const PriceRange: React.FC<{ name: string }> = ({ name }) => {
  const { setValue, control } = useFormContext();
  const { price, freePrice } = useWatch({ name, control });

  return (
    <Form.Item
      extra='Пожалуйста, укажите цену или диапазон цен. Для бесплатных событий поставьте "Бесплатно".'
      style={{ marginBottom: 0 }}
    >
      <Row gutter={[24, 0]}>
        <Col span={6}>
          <InputField
            name={`${name}.price`}
            label='Цена'
            type='price'
            suffix='₽'
            disabled={freePrice}
            formItemStyle={{ marginBottom: 8, fontWeight: 'bold' }}
            style={{ fontWeight: 'normal' }}
            maxLength={8}
          />
        </Col>
        <Col span={6}>
          <InputField
            name={`${name}.maxPrice`}
            label='Макс. цена'
            type='price'
            suffix='₽'
            disabled={!price || freePrice}
            formItemStyle={{ marginBottom: 8, fontWeight: 'bold' }}
            style={{ fontWeight: 'normal' }}
            maxLength={8}
          />
        </Col>
        <Row style={{ marginLeft: 8 }}>
          <Col span={6}>
            <Row align='bottom' style={{ height: 62 }}>
              <Checkbox
                checked={freePrice}
                onChange={e =>
                  setValue(name, {
                    price: null,
                    maxPrice: null,
                    freePrice: e.target.checked,
                  })
                }
              >
                Бесплатно
              </Checkbox>
            </Row>
          </Col>
        </Row>
      </Row>
    </Form.Item>
  );
};
