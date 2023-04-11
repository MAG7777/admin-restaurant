import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

import { MainLayout } from 'components/Layout/MainLayout';
import { PageTitles } from 'constants/pageTitles';
import { loadFaqList } from 'store/slices/faq/actions';
import { useAppDispatch, useAppSelector } from 'store';
import { useQuery } from 'hooks/useQuery';
import { useDeepEffect } from 'utils/useDeepEffect';

import { Filters } from './components/Filters';
import { FAQList } from './components/FAQList';

export const List = () => {
  const query = useQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list } = useAppSelector(state => state.faq);

  useDeepEffect(() => {
    dispatch(loadFaqList(query));
  }, [query]);

  const onCreateClick = () => navigate('add');

  const buttonList = [
    <Button key={1} onClick={onCreateClick} type='primary'>
      Создать
    </Button>,
  ];

  return (
    <MainLayout
      pageTitle={PageTitles['faq']}
      extraButtonsList={buttonList}
      aside={<Filters />}
    >
      <FAQList items={list} />
    </MainLayout>
  );
};
