import React from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router';

import { MainLayout } from 'components/Layout/MainLayout';
import { useAppDispatch } from 'store';
import { saveFaqItem } from 'store/slices/faq/actions';
import { FAQItem } from 'store/slices/faq/interfaces';

import { FAQForm } from './components/FAQForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submit = (values: FAQItem) =>
    dispatch(saveFaqItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Вопрос успешно добавлен',
        });
        navigate('/faq');
      });

  return (
    <MainLayout pageTitle='Создание вопрос-ответа'>
      <FAQForm onSubmit={submit} />
    </MainLayout>
  );
};
