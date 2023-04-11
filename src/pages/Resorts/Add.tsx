import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { prepareContent } from 'components/form/Content/utils';
import {
  saveResortItem,
  saveResortItemAsDraft,
} from 'store/slices/resorts/actions';
import { IResortItem } from 'store/slices/resorts/interfaces';
import { StatusesEnum } from 'constants/status';

import { ResortsForm } from './components/ResortsForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = (values: IResortItem) => {
    dispatch(saveResortItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/resorts');
      });
  };
  const onSaveDraft = (values: IResortItem) => {
    dispatch(saveResortItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/resorts');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/resorts');
  };
  return (
    <MainLayout pageTitle='Создание'>
      <ResortsForm
        onFinish={onFinish}
        onSaveDraft={onSaveDraft}
        cancelButtonHandler={cancelButtonHandler}
        isDraft
        initialValues={{
          name: '',
          image: null,
          category: null,
          tags: [],
          content: prepareContent([]),
          gallery: [],
          address: {},
          workTime: {
            fri: { from: null, to: null },
            mon: { from: null, to: null },
            sat: { from: null, to: null },
            sun: { from: null, to: null },
            thu: { from: null, to: null },
            tue: { from: null, to: null },
            wed: { from: null, to: null },
          },
          contacts: [],
          status: StatusesEnum.PUBLISHED,
        }}
      />
    </MainLayout>
  );
};
