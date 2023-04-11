import React from 'react';
import { Alert, Button, Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from 'store';
import { signOut } from 'store/slices/account/accountSlice';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';

export const WaitingForRole = () => {
  const { firstName, lastName, email } = useAppSelector(state => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/login');
  };
  return (
    <AuthLayout>
      <Space
        size='large'
        direction='vertical'
        style={{ width: '100%', marginTop: '24px' }}
      >
        <Alert
          message='Доступ в кабинет администратора запрещен'
          description={
            <div>
              Для получения доступа к кабинету администратора обратитесь,
              пожалуйста, к администратору портала по адресу{' '}
              <Typography.Link href='mailto:info@ncrc.ru'>
                info@ncrc.ru
              </Typography.Link>
            </div>
          }
          type='warning'
          showIcon
        />
        <Content style={{ padding: '24px 36px 32px' }}>
          <Row justify='center'>
            <Typography.Text
              style={{ fontSize: '12px', lineHeight: '20px', color: '#8C8C8C' }}
            >
              Данные пользователя
            </Typography.Text>
          </Row>
          <Row justify='center' style={{ marginTop: '8px' }}>
            <Typography.Text>{`${lastName} ${firstName}`}</Typography.Text>
          </Row>
          <Row justify='center' style={{ marginTop: '4px' }}>
            <Typography.Text>{email}</Typography.Text>
          </Row>
          <Row justify='center' style={{ marginTop: '24px' }}>
            <Button type='primary' onClick={handleSignOut}>
              Выйти
            </Button>
          </Row>
        </Content>
      </Space>
    </AuthLayout>
  );
};
