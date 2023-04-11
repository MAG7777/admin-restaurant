import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { IEventsItem } from 'store/slices/events/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  loadEventsItem,
  saveEventsItem,
  saveEventsItemAsDraft,
} from 'store/slices/events/actions';

import { EventsForm } from './components/EventsForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit = () => {
  const { item } = useAppSelector(state => state.events);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(loadEventsItem(id));
  }, []);

  const onFinish = (values: IEventsItem) => {
    dispatch(saveEventsItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/events');
      });
  };

  const onSaveDraft = (values: IEventsItem) => {
    dispatch(saveEventsItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/events');
      });
  };

  const cancelButtonHandler = () => {
    navigate('/events');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <EventsForm
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
