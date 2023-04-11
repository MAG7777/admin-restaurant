import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { IArticlesItem } from 'store/slices/articles/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  saveArticlesItem,
  loadArticlesItem,
  saveArticlesItemAsDraft,
} from 'store/slices/articles/actions';

import { ArticlesForm } from './components/ArticlesForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit: React.FC = () => {
  const { item } = useAppSelector(state => state.articles);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(loadArticlesItem(id));
  }, []);

  const onFinish = (values: IArticlesItem) => {
    dispatch(saveArticlesItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/articles');
      });
  };

  const onSaveDraft = (values: IArticlesItem) => {
    dispatch(saveArticlesItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/articles');
      });
  };

  const cancelButtonHandler = () => {
    navigate('/articles');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <ArticlesForm
          onFinish={onFinish}
          onSaveDraft={onSaveDraft}
          cancelButtonHandler={cancelButtonHandler}
          isDraft={item.status === 'draft'}
          initialValues={mapValuesToForm(item)}
        />
      ) : null}
    </MainLayout>
  );
};
