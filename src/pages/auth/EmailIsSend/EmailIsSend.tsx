import React from 'react';
import { Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import { useAppSelector } from 'store';
import { useQuery } from 'hooks/useQuery';
import { registerEmailRetry } from 'store/slices/account/actions';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';
import { ResendEmailTimer } from '../components/ResendEmailTimer/ResendEmailTimer';

export const EmailIsSend = () => {
  const email = useAppSelector(state => state.account.email);
  const query = useQuery();
  return (
    <AuthLayout>
      <Space size='large' direction='vertical' style={{ width: '100%' }}>
        <Content style={{ padding: '24px 36px' }}>
          <Row justify='center'>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Подтвердите email
            </Typography.Title>
          </Row>
          <Row justify='center'>
            <Space
              size='large'
              direction='vertical'
              style={{ marginTop: '24px', maxWidth: '425px', flex: '1' }}
            >
              <div style={{ fontSize: '16px' }}>
                <div>
                  <Typography.Text>
                    Мы отправили письмо на{' '}
                    <Typography.Text strong>{email}</Typography.Text>.
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text>
                    Для подтверждения перейдите по ссылке из письма.
                  </Typography.Text>
                </div>
              </div>
              <ResendEmailTimer
                initialValue={query.skipTimer ? 0 : undefined}
                onEmailResend={() => registerEmailRetry(email)}
              />
            </Space>
          </Row>
        </Content>
      </Space>
    </AuthLayout>
  );
};
