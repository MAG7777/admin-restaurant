import React from 'react';
import {
  DeleteOutlined,
  GlobalOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Form, Row } from 'antd';

import {
  defaultContactNames,
  DefaultContactOptionsTypes,
} from './ContactsSelector';
import { MaskedInput } from '../base/MaskedInput';
import { CustomIcon, SvgIconNames } from '../../icons/icons';

interface ContactInputProps {
  type: DefaultContactOptionsTypes;
  handleClear: () => void;
  name: string;
  value: string;
  onChange: (value: unknown) => void;
  error: any;
}

const inputTypes = {
  [DefaultContactOptionsTypes.Phone]: {
    placeholder: '999 999 99 99',
  },
  [DefaultContactOptionsTypes.Email]: {
    placeholder: 'Введите email',
    icon: <MailOutlined />,
  },
  [DefaultContactOptionsTypes.Site]: {
    placeholder: 'Ссылка на сайт',
    icon: <GlobalOutlined />,
  },
  [DefaultContactOptionsTypes.VK]: {
    placeholder: 'https://vk.com/1',
    icon: <CustomIcon name={SvgIconNames.VK} />,
  },
  [DefaultContactOptionsTypes.OK]: {
    placeholder: 'https://ok.ru/1',
    icon: <CustomIcon name={SvgIconNames.OK} />,
  },
  [DefaultContactOptionsTypes.Telegram]: {
    placeholder: 'https://t.me/1',
    icon: <CustomIcon name={SvgIconNames.Telegram} />,
  },
  [DefaultContactOptionsTypes.YandexDzen]: {
    placeholder: 'https://zen.yandex.ru/1',
    icon: <CustomIcon name={SvgIconNames.YandexDzen} />,
  },
};

export const ContactInput: React.FC<ContactInputProps> = React.forwardRef(
  ({ type, handleClear, error, ...props }, ref) => (
    <Col md={{ span: 12 }} xs={{ span: 24 }}>
      <Form.Item
        help={error?.message}
        validateStatus={error?.message ? 'error' : 'success'}
        label={defaultContactNames[type]}
      >
        <Row gutter={12}>
          <Col flex='auto'>
            <>
              {type === DefaultContactOptionsTypes.Phone ? (
                <MaskedInput
                  {...props}
                  addonBefore='+7'
                  onChange={e =>
                    props.onChange(e.target.value.replace(/[^\d]+/g, ''))
                  }
                  mask='111 111 11 11'
                  placeholder={inputTypes[type].placeholder}
                />
              ) : (
                <Input
                  {...props}
                  placeholder={inputTypes[type].placeholder}
                  prefix={inputTypes[type].icon}
                />
              )}
            </>
          </Col>
          <Col>
            <Button icon={<DeleteOutlined />} onClick={handleClear} />
          </Col>
        </Row>
      </Form.Item>
    </Col>
  )
);

ContactInput.displayName = 'AddressSelector';
