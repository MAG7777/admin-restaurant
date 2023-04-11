import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { ICatalogItem } from 'store/slices/catalog/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import { saveCatalogItem } from 'store/slices/catalog/actions';

import { CatalogForm } from './components/CatalogForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = (values: ICatalogItem) => {
    dispatch(saveCatalogItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/catalog');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/catalog');
  };
  return (
    <MainLayout pageTitle='Создание данных полей'>
      <CatalogForm
        onFinish={onFinish}
        cancelButtonHandler={cancelButtonHandler}
        initialValues={{ name: '', entityType: null, fieldType: null }}
      />
    </MainLayout>
  );
};
