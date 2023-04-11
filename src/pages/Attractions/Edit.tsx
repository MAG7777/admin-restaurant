import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { notification } from 'antd';

import { useAppDispatch, useAppSelector } from 'store';
import { IAttractionItem } from 'store/slices/attractions/interfaces';
import { MainLayout } from 'components/Layout/MainLayout';
import {
  loadAttractionItem,
  saveAttractionItem,
  saveAttractionItemAsDraft,
} from 'store/slices/attractions/actions';
import { StatusesEnum } from 'constants/status';

import { AttractionsForm } from './components/AttractionsForm';
import { mapValuesToForm } from './components/formUtils';

export const Edit = () => {
  const { item } = useAppSelector(state => state.attractions);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(loadAttractionItem(id));
  }, []);
  const onFinish = (values: IAttractionItem) => {
    dispatch(saveAttractionItem({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/attractions');
      });
  };
  const onSaveDraft = (values: IAttractionItem) => {
    dispatch(saveAttractionItemAsDraft({ ...values, id: item.id }))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно изменена',
        });
        navigate('/attractions');
      });
  };
  const cancelButtonHandler = () => {
    navigate('/attractions');
  };

  return (
    <MainLayout pageTitle='Редактирование'>
      {item.id && item.id === Number(id) ? (
        <AttractionsForm
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
