import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { INewsItem } from 'store/slices/news/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import { saveNewsItem, saveNewsItemAsDraft } from 'store/slices/news/actions';
import { prepareContent } from 'components/form/Content/utils';
import { StatusesEnum } from 'constants/status';

import { NewsForm } from './components/NewsForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = (values: INewsItem) => {
    dispatch(saveNewsItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/news');
      });
  };

  const onSaveDraft = (values: INewsItem) => {
    dispatch(saveNewsItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/news');
      });
  };

  const cancelButtonHandler = () => {
    navigate('/news');
  };

  return (
    <MainLayout pageTitle='Создание'>
      <NewsForm
        onFinish={onFinish}
        onSaveDraft={onSaveDraft}
        cancelButtonHandler={cancelButtonHandler}
        isDraft
        initialValues={{
          name: '',
          image: null,
          content: prepareContent([]),
          region: null,
          shortDescription: '',
          tags: [],
          topic: null,
          source: '',
          status: StatusesEnum.PUBLISHED,
        }}
      />
    </MainLayout>
  );
};
