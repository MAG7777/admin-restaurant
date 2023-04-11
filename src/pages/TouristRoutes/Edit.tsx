import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  loadTouristRoutesItem,
  saveTouristRoutesItem,
  saveTouristRoutesItemAsDraft,
} from 'store/slices/touristRoutes/actions';
import {
  ITouristRoutesDraftItem,
  ITouristRoutesItem,
} from 'store/slices/touristRoutes/interfaces';
import { StatusesEnum } from 'constants/status';

import { TouristRoutesForm } from './components/TouristRoutesForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit = () => {
  const { item } = useAppSelector(state => state.touristRoutes);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(loadTouristRoutesItem(id));
  }, []);
  const onFinish = (values: ITouristRoutesItem) => {
    dispatch(saveTouristRoutesItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/touristRoutes');
      });
  };
  const onSaveDraft = (values: ITouristRoutesDraftItem) => {
    dispatch(saveTouristRoutesItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/touristRoutes');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/touristRoutes');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <TouristRoutesForm
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
