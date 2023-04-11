import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { prepareContent } from 'components/form/Content/utils';
import {
  saveEventsItem,
  saveEventsItemAsDraft,
} from 'store/slices/events/actions';
import { IEventsItem } from 'store/slices/events/interfaces';
import { StatusesEnum } from 'constants/status';

import { ageRestriction, EventsForm } from './components/EventsForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = (values: IEventsItem) => {
    dispatch(saveEventsItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/events');
      });
  };
  const onSaveDraft = (values: IEventsItem) => {
    dispatch(saveEventsItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/events');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/events');
  };
  return (
    <MainLayout pageTitle='Создание'>
      <EventsForm
        onFinish={onFinish}
        onSaveDraft={onSaveDraft}
        cancelButtonHandler={cancelButtonHandler}
        isDraft
        initialValues={{
          name: '',
          image: null,
          category: null,
          tags: [],
          region: null,
          shortDescription: '',
          gallery: [],
          content: prepareContent([]),
          ageRestriction: ageRestriction[0],
          places: [],
          price: {
            price: null,
            maxPrice: null,
            freePrice: false,
          },
          externalUrl: '',
          duration: null,
          status: StatusesEnum.PUBLISHED,
        }}
      />
    </MainLayout>
  );
};
