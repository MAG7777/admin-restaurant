import React from 'react';
import { Button, Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';

import { PasswordField } from 'components/form/base/PasswordField';
import { useQuery } from 'hooks/useQuery';
import { useAppDispatch } from 'store';
import { passwordResetConfirm } from 'store/slices/account/actions';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .trim()
    .required('Введите пароль.')
    .matches(
      /^([!@#$%^&*()\-_=+{};:,<.>a-zA-Z0-9])*$/,
      'Пароль может содержать только латинские буквы, цифры и спецсимволы(!@#$%^&*()-_=+{};:,<.>)'
    )
    .matches(
      /^.*(?=.{9,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Пароль должен содержать не менее 9 знаков, включать хотя бы одну заглавную латинскую букву, одну строчную, цифры и специальные символы'
    ),
  newPasswordConfirm: Yup.string()
    .test('isMatch', 'Пароли должны совпадать', function (value) {
      return value === this.parent.newPassword;
    })
    .required('Введите пароль ещё раз.'),
});

export const PasswordResetConfirm = () => {
  const query = useQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const submit = values => {
    dispatch(
      passwordResetConfirm({
        email: query.email as string,
        passwordResetToken: query.token as string,
        newPassword: values.newPassword,
        newPasswordConfirm: values.newPasswordConfirm,
        userType: query.userType as string,
      })
    )
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
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              Придумайте новый пароль для входа
            </Typography.Title>
          </Row>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className='ant-form ant-form-vertical indent-top'
            >
              <PasswordField
                name='newPassword'
                required
                label='Пароль'
                placeholder='Введите новый пароль'
                tooltip='Пароль должен содержать не менее 9 знаков, включать хотя бы одну заглавную латинскую букву, одну строчную, цифры и специальные символы'
              />
              <PasswordField
                name='newPasswordConfirm'
                required
                label='Повторите пароль'
                placeholder='Введите новый пароль ещё раз'
              />
              <Row justify='center'>
                <Space size='large'>
                  <Link to='/login'>
                    <Button>Отменить</Button>
                  </Link>
                  <Button type='primary' htmlType='submit'>
                    Изменить пароль
                  </Button>
                </Space>
              </Row>
            </form>
          </FormProvider>
        </Content>
      </Space>
    </AuthLayout>
  );
};
