import React, { useState } from 'react';
import { Button, notification, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';

import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { useQuery } from 'hooks/useQuery';
import { useDeepEffect } from 'utils/useDeepEffect';
import { StickyConfirmModal } from 'components/modals/StickyConfirmModal';
import {
  loadCatalogList,
  removeCatalogItem,
} from 'store/slices/catalog/actions';
import { PageTitles } from 'constants/pageTitles';

import { Filters } from './components/Filters';
import { ListTable } from './components/ListTable';

export const List = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const { list, total, limit } = useAppSelector(state => state.catalog);
  const [sort, setSort] = React.useState(null);
  const loadServices = () => {
    dispatch(
      loadCatalogList({
        ...query,
        sort,
      })
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);

  useDeepEffect(() => {
    loadServices();
  }, [query, sort]);

  const modalCloseHandler = () => {
    setModalIsOpen(null);
    setCurrentItemId(null);
  };

  const handleRemove = async () => {
    await dispatch(removeCatalogItem(currentItemId))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно удалена',
        });
        loadServices();
        modalCloseHandler();
      });
  };

  const getActions = item => [
    {
      element: <Link to={`/catalog/${item.id}/edit`}>Редактировать</Link>,
    },
    {
      element: <Typography.Text type='danger'>Удалить</Typography.Text>,
      handler: () => {
        setModalIsOpen('remove');
        setCurrentItemId(item.id);
      },
    },
  ];

  return (
    <MainLayout
      pageTitle={PageTitles['catalog']}
      extraButtonsList={[
        <Link key={1} to='/catalog/add'>
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
      {currentItemId && (
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
