import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { MainLayout } from 'components/Layout/MainLayout';
import { useAppDispatch, useAppSelector } from 'store';
import { loadFaqItem, saveFaqItem } from 'store/slices/faq/actions';
import { FAQItem } from 'store/slices/faq/interfaces';
import { setItem } from 'store/slices/faq/faqSlice';

import { CATEGORY_OPTIONS, FAQForm } from './components/FAQForm';

export const Edit = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { item } = useAppSelector(state => state.faq);

  const isSameItem = Number(id) === item?.id;

  const defaultValues = {
    id: item?.id,
    answer: item?.answer,
    question: item?.question,
    category: CATEGORY_OPTIONS.find(({ value }) => value === item?.category),
  };

  const submit = (values: FAQItem) => {
    const newItem = { ...values, id: item?.id };

    dispatch(saveFaqItem(newItem))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Вопрос успешно изменен',
        });
        dispatch(setItem(newItem));
        navigate('/faq');
      });
  };

  useEffect(() => {
    dispatch(loadFaqItem(id));
  }, [id]);

  return (
    <MainLayout pageTitle='Редактирование вопрос-ответа'>
      {isSameItem && (
        <FAQForm onSubmit={submit} defaultValues={defaultValues} />
      )}
    </MainLayout>
  );
};
