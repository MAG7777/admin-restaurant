import React from 'react';
import { Button, Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import { InputField } from 'components/form/base/InputField';
import { useAppDispatch } from 'store';
import { passwordResetRequest } from 'store/slices/account/actions';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';
import { ResendEmailTimer } from '../components/ResendEmailTimer/ResendEmailTimer';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email.')
    .trim()
    .required('Введите email.'),
});

export const PasswordResetRequest = () => {
  const dispatch = useAppDispatch();
  const [emailIsSend, setEmailIsSend] = React.useState<boolean>(false);
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const submit = values => {
    dispatch(passwordResetRequest({ email: values.email }))
      .unwrap()
      .then(() => setEmailIsSend(true));
  };
  return (
    <AuthLayout>
      <Space size='large' direction='vertical' style={{ width: '100%' }}>
        <Content style={{ padding: '24px 36px' }}>
          <Row justify='center'>
            <Typography.Title level={4} style={{ marginBottom: '24px' }}>
              Восстановление пароля
            </Typography.Title>
          </Row>
          <Row justify='center'>
            {emailIsSend ? (
              <Space size='large' direction='vertical'>
                <Typography.Text
                  style={{ fontSize: '16px', lineHeight: '24px' }}
                >
                  На вашу электронную почту{' '}
                  <Typography.Text strong>
                    {methods.getValues('email')}
                  </Typography.Text>{' '}
                  отправлена ссылка для восстановления пароля.
                </Typography.Text>
                <ResendEmailTimer
                  onEmailResend={() =>
                    passwordResetRequest({ email: methods.getValues('email') })
                  }
                />
              </Space>
            ) : (
              <Typography.Text>
                Укажите email, который вы использовали для регистрации.
              </Typography.Text>
            )}
          </Row>
          {!emailIsSend && (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(submit)}
                className='ant-form ant-form-vertical indent-top'
              >
                <InputField
                  name='email'
                  required
                  label='Email'
                  placeholder='Введите email'
                />
                <Row justify='center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ minWidth: '168px' }}
                  >
                    Отправить
                  </Button>
                </Row>
              </form>
            </FormProvider>
          )}
        </Content>
        <Content style={{ padding: '16px' }}>
          <Row justify='center'>
            <Link to='/login'>Вернуться назад</Link>
          </Row>
        </Content>
      </Space>
    </AuthLayout>
  );
};
