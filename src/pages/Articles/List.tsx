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
  loadArticlesList,
  setPublishArticle,
  setUnPublishArticle,
} from 'store/slices/articles/actions';
import { PageTitles } from 'constants/pageTitles';
import { IArticlesItem } from 'store/slices/articles/interfaces';
import { canBePublished, canBeUnPublished } from 'utils/rights';
import { StatusesEnum } from 'constants/status';

import { Filters } from './components/Filters';
import { ListTable } from './components/ListTable';

export const List = () => {
  const [sort, setSort] = React.useState(null);
  const dispatch = useAppDispatch();
  const query = useQuery();

  const { list, total, limit } = useAppSelector(state => state.articles);
  const loadArticles = () => {
    dispatch(
      loadArticlesList({
        ...query,
        sort,
      })
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IArticlesItem | null>(null);

  useDeepEffect(() => {
    loadArticles();
  }, [query, sort]);

  const modalCloseHandler = () => {
    setModalIsOpen(false);
    setCurrentItem(null);
  };

  const handleRemove = async () => {
    // await dispatch(removeArticlesItem({ id }))
    //   .unwrap()
    //   .then(() => {
    //     notification.success({
    //       message: 'Cущность успешно удалена',
    //     });
    //     loadArticles();
    //     modalCloseHandler();
    //   });
  };

  const handlePublish = async id => {
    await dispatch(setPublishArticle(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно опубликована',
        });
        loadArticles();
        modalCloseHandler();
      });
  };

  const handleUnPublish = async id => {
    await dispatch(setUnPublishArticle(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно снята с публикации',
        });
        loadArticles();
        modalCloseHandler();
      });
  };

  const getActions = item => [
    item.status === StatusesEnum.PUBLISHED && {
      element: <Typography.Text>На сайте</Typography.Text>,
      handler: () => console.log('link to portal'),
    },
    {
      element: <Link to={`/articles/${item.id}/edit`}>Редактировать</Link>,
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
      pageTitle={PageTitles['articles']}
      extraButtonsList={[
        <Link key={1} to='/articles/add'>
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
              title='Удаление статьи'
              okText='Удалить'
              text={
                <div>
                  Вы хотите убрать с портала и переместить в Корзину статью{' '}
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
