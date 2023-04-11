import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { IResortItem } from 'store/slices/resorts/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  loadResortItem,
  saveResortItem,
  saveResortItemAsDraft,
} from 'store/slices/resorts/actions';
import { StatusesEnum } from 'constants/status';

import { ResortsForm } from './components/ResortsForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit = () => {
  const { item } = useAppSelector(state => state.resorts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(loadResortItem(id));
  }, []);
  const onFinish = (values: IResortItem) => {
    dispatch(saveResortItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/resorts');
      });
  };
  const onSaveDraft = (values: IResortItem) => {
    dispatch(saveResortItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/resorts');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/resorts');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <ResortsForm
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
