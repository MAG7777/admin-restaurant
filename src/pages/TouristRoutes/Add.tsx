import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { prepareContent } from 'components/form/Content/utils';
import {
  ITouristRoutesDraftItem,
  ITouristRoutesItem,
} from 'store/slices/touristRoutes/interfaces';
import {
  saveTouristRoutesItem,
  saveTouristRoutesItemAsDraft,
} from 'store/slices/touristRoutes/actions';
import { StatusesEnum } from 'constants/status';

import { TouristRoutesForm } from './components/TouristRoutesForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = (values: ITouristRoutesItem) => {
    dispatch(saveTouristRoutesItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/touristRoutes');
      });
  };
  const onSaveDraft = (values: ITouristRoutesDraftItem) => {
    dispatch(saveTouristRoutesItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/touristRoutes');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/touristRoutes');
  };
  return (
    <MainLayout pageTitle='Создание'>
      <TouristRoutesForm
        onFinish={onFinish}
        onSaveDraft={onSaveDraft}
        cancelButtonHandler={cancelButtonHandler}
        isDraft
        initialValues={{
          name: '',
          image: null,
          tags: [],
          shortDescription: '',
          routeType: null,
          routeLevel: null,
          content: prepareContent([]),
          status: StatusesEnum.PUBLISHED,
          audio: null,
          points: [],
          polyline: [],
          days: 0,
          duration: '',
          externalUrl: '',
        }}
      />
    </MainLayout>
  );
};
