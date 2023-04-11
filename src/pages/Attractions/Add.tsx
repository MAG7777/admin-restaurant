import React from 'react';
import { useNavigate } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { prepareContent } from 'components/form/Content/utils';
import {
  saveAttractionItem,
  saveAttractionItemAsDraft,
} from 'store/slices/attractions/actions';
import { IAttractionItem } from 'store/slices/attractions/interfaces';
import { StatusesEnum } from 'constants/status';

import { AttractionsForm } from './components/AttractionsForm';

export const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = (values: IAttractionItem) => {
    dispatch(saveAttractionItem(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/attractions');
      });
  };
  const onSaveDraft = (values: IAttractionItem) => {
    dispatch(saveAttractionItemAsDraft(values))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно создана',
        });
        navigate('/attractions');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/attractions');
  };
  return (
    <MainLayout pageTitle='Создание'>
      <AttractionsForm
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
