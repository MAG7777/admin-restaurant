import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { IArticlesItem } from 'store/slices/articles/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  saveArticlesItem,
  saveArticlesItemAsDraft,
} from 'store/slices/articles/actions';
import { prepareContent } from 'components/form/Content/utils';
import { StatusesEnum } from 'constants/status';

import { ArticlesForm } from './components/ArticlesForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = (values: IArticlesItem) => {
    dispatch(saveArticlesItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/articles');
      });
  };

  const onSaveDraft = (values: IArticlesItem) => {
    dispatch(saveArticlesItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/articles');
      });
  };

  const cancelButtonHandler = () => {
    navigate('/articles');
  };

  return (
    <MainLayout pageTitle='Создание'>
      <ArticlesForm
        onFinish={onFinish}
        onSaveDraft={onSaveDraft}
        cancelButtonHandler={cancelButtonHandler}
        isDraft
        initialValues={{
          name: '',
          image: null,
          shortName: '',
          category: null,
          region: null,
          tags: [],
          content: prepareContent([]),
          status: StatusesEnum.PUBLISHED,
        }}
      />
    </MainLayout>
  );
};
