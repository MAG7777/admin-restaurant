import React from 'react';
import { Button, Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';

import Yup from 'utils/yup';
import { InputField } from 'components/form/base/InputField';
import { PasswordField } from 'components/form/base/PasswordField';
import { signIn } from 'store/slices/account/actions';
import { useAppDispatch } from 'store';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email.')
    .trim()
    .required('Введите email.'),
  password: Yup.string().trim().required('Введите пароль.'),
});

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const submit = values => {
    dispatch(signIn({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      });
  };

  return (
    <AuthLayout>
      <Space size='large' direction='vertical' style={{ width: '100%' }}>
        <Content style={{ padding: '24px 36px' }}>
          <Row justify='center'>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Вход
            </Typography.Title>
          </Row>
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
              <PasswordField
                name='password'
                required
                label='Пароль'
                placeholder='Введите пароль'
              />
              <Space
                size='large'
                direction='vertical'
                style={{ width: '100%' }}
              >
                <Link to='/password-reset-request'>Забыли пароль?</Link>
                <Row justify='center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ minWidth: '168px' }}
                  >
                    Войти
                  </Button>
                </Row>
              </Space>
            </form>
          </FormProvider>
        </Content>
        <Content style={{ padding: '16px' }}>
          <Row justify='center'>
            <Link to='/registration'>Зарегистрироваться</Link>
          </Row>
        </Content>
      </Space>
    </AuthLayout>
  );
};
