import React from 'react';
import { Button, Row, Space, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';

import Yup from 'utils/yup';
import { InputField } from 'components/form/base/InputField';
import { PasswordField } from 'components/form/base/PasswordField';
import { useAppDispatch } from 'store';
import { registration } from 'store/slices/account/actions';

import { AuthLayout } from '../components/AuthLayout/AuthLayout';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email.')
    .trim()
    .required('Введите email.'),
  password: Yup.string()
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
  passwordConfirm: Yup.string()
    .test('isMatch', 'Пароли должны совпадать', function (value) {
      return value === this.parent.password;
    })
    .required('Введите пароль ещё раз.'),
  firstName: Yup.string()
    .required()
    .min(2, 'Минимум 2 символа')
    .max(75, 'Максимум 75 символов')
    .matches(
      /^([А-ЯЁа-яё\- '])+$/,
      `Допустимы для ввода только буквы русского алфавита и специальные символы «-» (дефис), «'» (апостроф) и пробел`
    )
    .test(
      'isMatch',
      `Запрещается использование 2 одинаковых спецсимволов подряд`,
      function (value) {
        return !(
          value.includes(`''`) ||
          value.includes(`  `) ||
          value.includes(`--`)
        );
      }
    ),
  lastName: Yup.string()
    .required()
    .min(2, 'Минимум 2 символа')
    .max(75, 'Максимум 75 символов')
    .matches(
      /^([А-ЯЁа-яё\- '])+$/,
      `Допустимы для ввода только буквы русского алфавита и специальные символы «-» (дефис), «'» (апостроф) и пробел`
    )
    .test(
      'isMatch',
      `Запрещается использование 2 одинаковых спецсимволов подряд`,
      function (value) {
        return !(
          value.includes(`''`) ||
          value.includes(`  `) ||
          value.includes(`--`)
        );
      }
    ),
});

export const Registration = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const submit = async values => {
    dispatch(registration(values))
      .unwrap()
      .then(() => {
        navigate('/email-is-send');
      });
  };
  return (
    <AuthLayout>
      <Space size='large' direction='vertical' style={{ width: '100%' }}>
        <Content style={{ padding: '24px 36px' }}>
          <Row justify='center'>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Регистрация
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
                tooltip='Пароль должен содержать не менее 9 знаков, включать хотя бы одну заглавную латинскую букву, одну строчную, цифры и специальные символы'
              />
              <PasswordField
                name='passwordConfirm'
                required
                label='Повторите пароль'
                placeholder='Введите пароль ещё раз'
              />
              <InputField
                name='firstName'
                required
                label='Имя'
                placeholder='Введите имя'
              />
              <InputField
                name='lastName'
                required
                label='Фамилия'
                placeholder='Введите фамилию'
              />
              <div style={{ fontSize: '12px', textAlign: 'center' }}>
                Нажимая «Зарегистрироваться», вы соглашаетесь с&nbsp;
                <Link to='/forgotpassword' target='_blank'>
                  Условиями
                </Link>
                .
              </div>
              <Row justify='center' style={{ marginTop: '12px' }}>
                <Button type='primary' htmlType='submit'>
                  Зарегистрироваться
                </Button>
              </Row>
            </form>
          </FormProvider>
        </Content>
        <Content style={{ padding: '16px' }}>
          <Row
            justify='center'
            style={{ flexFlow: 'column nowrap', alignItems: 'center' }}
          >
            <div style={{ fontSize: '16px' }}>Уже регистрировались?</div>
            <div>
              <Link to='/login'>Войти</Link>
            </div>
          </Row>
        </Content>
      </Space>
    </AuthLayout>
  );
};
