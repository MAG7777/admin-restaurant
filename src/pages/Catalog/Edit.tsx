import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { loadCatalogItem, saveCatalogItem } from 'store/slices/catalog/actions';
import { IEditRequestValues } from 'store/slices/catalog/interfaces';

import { CatalogForm } from './components/CatalogForm';

export const Edit = () => {
  const { item } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(loadCatalogItem(id));
  }, []);
  const onFinish = (values: IEditRequestValues) => {
    dispatch(saveCatalogItem(values as IEditRequestValues))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/catalog');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/catalog');
  };
  return (
    <MainLayout pageTitle='Редактирование данных полей'>
      {item.id && item.id === Number(id) ? (
        <CatalogForm
          onFinish={onFinish}
          cancelButtonHandler={cancelButtonHandler}
          initialValues={item}
        />
      ) : null}
    </MainLayout>
  );
};
