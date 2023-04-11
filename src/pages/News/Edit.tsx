import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { INewsItem } from 'store/slices/news/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  saveNewsItem,
  loadNewsItem,
  saveNewsItemAsDraft,
} from 'store/slices/news/actions';
import { StatusesEnum } from 'constants/status';

import { NewsForm } from './components/NewsForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit: React.FC = () => {
  const { item } = useAppSelector(state => state.news);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(loadNewsItem(id));
  }, []);

  const onFinish = (values: INewsItem) => {
    dispatch(saveNewsItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/news');
      });
  };

  const onSaveDraft = (values: INewsItem) => {
    dispatch(saveNewsItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/news');
      });
  };

  const cancelButtonHandler = () => {
    navigate('/news');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <NewsForm
          onFinish={onFinish}
          onSaveDraft={onSaveDraft}
          cancelButtonHandler={cancelButtonHandler}
          isDraft={item.status === StatusesEnum.DRAFT}
          initialValues={mapValuesToForm(item)}
        />
      ) : null}
    </MainLayout>
  );
};
