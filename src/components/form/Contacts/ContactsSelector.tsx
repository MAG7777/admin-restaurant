import React from 'react';
import { Col, Form, Row, Select } from 'antd';

import { THandleChangeOptionType } from './index';

interface ContactsSelector {
  selectedInputs: Record<'id', string>[];
  handleSelectorChange: (option: THandleChangeOptionType) => void;
}

export enum DefaultContactOptionsTypes {
  Phone = 'phone',
  Email = 'email',
  Site = 'website',
  VK = 'vk',
  OK = 'ok',
  Telegram = 'tg',
  YandexDzen = 'zen',
}

export const defaultContactOptions = [
  {
    type: DefaultContactOptionsTypes.Phone,
    name: 'Телефон',
  },
  {
    type: DefaultContactOptionsTypes.Email,
    name: 'Email',
  },
  {
    type: DefaultContactOptionsTypes.Site,
    name: 'Веб-сайт',
  },
  {
    type: DefaultContactOptionsTypes.VK,
    name: 'Вконтакте',
  },
  {
    type: DefaultContactOptionsTypes.OK,
    name: 'Одноклассники',
  },
  {
    type: DefaultContactOptionsTypes.Telegram,
    name: 'Telegram',
  },
  {
    type: DefaultContactOptionsTypes.YandexDzen,
    name: 'Яндекс.Дзен',
  },
];

export const defaultContactNames = defaultContactOptions.reduce((acc, item) => {
  acc[item.type] = item.name;
  return acc;
}, {});

export const ContactsSelector: React.FC<ContactsSelector> = ({
  selectedInputs,
  handleSelectorChange,
}) => {
  return (
    <Row>
      <Col md={{ span: 8 }} xs={{ span: 24 }}>
        <Form.Item
          label={!selectedInputs.length && 'Контакт'}
          style={{ marginBottom: 0, marginTop: selectedInputs.length ? 8 : 0 }}
        >
          <Select
            defaultValue='Добавить контакт'
            value='Добавить контакт'
            onChange={(_, option) =>
              handleSelectorChange(option as unknown as THandleChangeOptionType)
            }
          >
            {defaultContactOptions.map(item => (
              <Select.Option key={item.type} value={item.name} type={item.type}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};
