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
  loadNewsList,
  setPublishNew,
  setUnPublishNew,
} from 'store/slices/news/actions';
import { PageTitles } from 'constants/pageTitles';
import { INewsItem } from 'store/slices/news/interfaces';
import { canBePublished, canBeUnPublished } from 'utils/rights';
import { StatusesEnum } from 'constants/status';

import { Filters } from './components/Filters';
import { ListTable } from './components/ListTable';

export const List = () => {
  const [sort, setSort] = React.useState(null);
  const dispatch = useAppDispatch();
  const query = useQuery();

  const { list, total, limit } = useAppSelector(state => state.news);
  const loadNews = () => {
    dispatch(
      loadNewsList({
        ...query,
        sort,
      })
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<INewsItem | null>(null);

  useDeepEffect(() => {
    loadNews();
  }, [query, sort]);

  const modalCloseHandler = () => {
    setModalIsOpen(false);
    setCurrentItem(null);
  };

  const handleRemove = async () => {
    // await dispatch(removeNewsItem({ id }))
    //   .unwrap()
    //   .then(() => {
    //     notification.success({
    //       message: 'Cущность успешно удалена',
    //     });
    //     loadNews();
    //     modalCloseHandler();
    //   });
  };

  const handlePublish = async id => {
    await dispatch(setPublishNew(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно опубликована',
        });
        loadNews();
        modalCloseHandler();
      });
  };

  const handleUnPublish = async id => {
    await dispatch(setUnPublishNew(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно снята с публикации',
        });
        loadNews();
        modalCloseHandler();
      });
  };

  const getActions = item => [
    item.status === StatusesEnum.PUBLISHED && {
      element: <Typography.Text>На сайте</Typography.Text>,
      handler: () => console.log('link to portal'),
    },
    {
      element: <Link to={`/news/${item.id}/edit`}>Редактировать</Link>,
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
        setModalIsOpen(true);
        setCurrentItem(item);
      },
    },
  ];

  return (
    <MainLayout
      pageTitle={PageTitles['news']}
      extraButtonsList={[
        <Link key={1} to='/news/add'>
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
          {modalIsOpen && (
            <StickyConfirmModal
              isOpen={modalIsOpen}
              onRequestClose={modalCloseHandler}
              title='Удаление новости'
              okText='Удалить'
              text={
                <div>
                  Вы хотите убрать с портала и переместить в Корзину новость{' '}
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
