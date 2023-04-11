import React, { useState } from 'react';
import { Button, notification, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';

import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { useQuery } from 'hooks/useQuery';
import { useDeepEffect } from 'utils/useDeepEffect';
import { StickyConfirmModal } from 'components/modals/StickyConfirmModal';
import {
  loadAttractionsList,
  setPublishAttraction,
  setUnPublishAttraction,
} from 'store/slices/attractions/actions';
import { PageTitles } from 'constants/pageTitles';
import { canBePublished, canBeUnPublished } from 'utils/rights';
import { StatusesEnum } from 'constants/status';

import { Filters } from './components/Filters';
import { ListTable } from './components/ListTable';

export const List = () => {
  const [sort, setSort] = React.useState(null);
  const dispatch = useAppDispatch();
  const query = useQuery();

  const { list, total, limit } = useAppSelector(state => state.attractions);
  const loadAttractions = () => {
    dispatch(
      loadAttractionsList({
        ...query,
        sort,
      })
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  useDeepEffect(() => {
    loadAttractions();
  }, [query, sort]);

  const modalCloseHandler = () => {
    setModalIsOpen(null);
    setCurrentItem(null);
  };

  const handleRemove = async () => {
    // await dispatch(removeAttractionsItem(currentItemId)).unwrap().then(() => {
    //   notification.success({
    //     message: 'Cущность успешно удалена',
    //   });
    //   loadAttractions();
    //   modalCloseHandler();
    // });
  };

  const handlePublish = async id => {
    await dispatch(setPublishAttraction(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно опубликована',
        });
        loadAttractions();
        modalCloseHandler();
      });
  };

  const handleUnPublish = async id => {
    await dispatch(setUnPublishAttraction(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно снята с публикации',
        });
        loadAttractions();
        modalCloseHandler();
      });
  };

  const getActions = item => [
    item.status === StatusesEnum.PUBLISHED && {
      element: <Typography.Text>На сайте</Typography.Text>,
      handler: () => console.log('link to portal'),
    },
    {
      element: <Link to={`/attractions/${item.id}/edit`}>Редактировать</Link>,
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
      pageTitle={PageTitles['attractions']}
      extraButtonsList={[
        <Link key={1} to='/attractions/add'>
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
              title='Удаление места'
              okText='Удалить'
              text={
                <div>
                  Вы хотите убрать с портала и переместить в Корзину место{' '}
                  <Typography.Text strong>
                    {currentItem.name || ''}
                  </Typography.Text>
                  ?
                </div>
              }
              onSubmit={handleRemove}
              okButtonProps={{ danger: true }}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};
