import React, { useState } from 'react';
import { Button, notification, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';

import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { useQuery } from 'hooks/useQuery';
import { useDeepEffect } from 'utils/useDeepEffect';
import { StickyConfirmModal } from 'components/modals/StickyConfirmModal';
import { PageTitles } from 'constants/pageTitles';
import {
  loadTouristRoutesList,
  setPublishTouristRoutes,
  setUnPublishTouristRoutes,
} from 'store/slices/touristRoutes/actions';
import { StatusesEnum } from 'constants/status';
import { canBePublished, canBeUnPublished } from 'utils/rights';

import { Filters } from './components/Filters';
import { ListTable } from './components/ListTable';

export const List = () => {
  const [sort, setSort] = React.useState(null);
  const dispatch = useAppDispatch();
  const query = useQuery();

  const { list, total, limit } = useAppSelector(state => state.touristRoutes);
  const loadTouristRoutes = () => {
    dispatch(
      loadTouristRoutesList({
        ...query,
        sort,
      })
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  useDeepEffect(() => {
    loadTouristRoutes();
  }, [query, sort]);

  const modalCloseHandler = () => {
    setModalIsOpen(null);
    setCurrentItem(null);
  };

  const handleRemove = async () => {
    // await dispatch(removeTouristRoutesItem(currentItem.id)).unwrap().then(() => {
    //   notification.success({
    //     message: 'Cущность успешно удалена',
    //   });
    //   loadAttractions();
    //   modalCloseHandler();
    // });
  };

  const handlePublish = async id => {
    await dispatch(setPublishTouristRoutes(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно опубликована',
        });
        loadTouristRoutes();
        modalCloseHandler();
      });
  };

  const handleUnPublish = async id => {
    await dispatch(setUnPublishTouristRoutes(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно снята с публикации',
        });
        loadTouristRoutes();
        modalCloseHandler();
      });
  };

  const getActions = item => [
    item.status === StatusesEnum.PUBLISHED && {
      element: <Typography.Text>На сайте</Typography.Text>,
      handler: () => console.log('link to portal'),
    },
    {
      element: <Link to={`/touristRoutes/${item.id}/edit`}>Редактировать</Link>,
    },
    canBePublished(item) && {
      element: <Typography.Text>Опубликовать</Typography.Text>,
      handler: () => handlePublish(item.id),
    },
    canBeUnPublished(item) && {
      element: <Typography.Text>Снять с публикации</Typography.Text>,
      handler: () => handleUnPublish(item.id),
    },
    {
      element: <Typography.Text type='danger'>Удалить</Typography.Text>,
      handler: () => {
        setModalIsOpen('remove');
        setCurrentItem(item);
      },
    },
  ];

  return (
    <MainLayout
      pageTitle={PageTitles.touristRoutes}
      extraButtonsList={[
        <Link key={1} to='/touristRoutes/add'>
          <Button type='primary'>Создать</Button>
        </Link>,
      ]}
      aside={<Filters />}
    >
      <Content>
        <ListTable
          data={list}
          total={total}
          getActions={getActions}
          limit={limit}
          setSort={setSort}
        />
      </Content>
      {currentItem?.id && (
        <>
          {modalIsOpen === 'remove' && (
            <StickyConfirmModal
              isOpen={modalIsOpen === 'remove'}
              onRequestClose={modalCloseHandler}
              title='Удаление сущности'
              okText='Удалить'
              text='Вы действительно хотите удалить эту cущность?'
              onSubmit={handleRemove}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};
