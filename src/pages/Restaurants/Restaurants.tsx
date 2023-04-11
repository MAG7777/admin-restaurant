import { Content } from 'antd/lib/layout/layout';
import React from 'react';

import { MainLayout } from 'components/Layout/MainLayout';
import { PageTitles } from 'constants/pageTitles';

export const Restaurants: React.FC = () => {
  return (
    <MainLayout pageTitle={PageTitles.restaurants}>
      <Content>LIST</Content>
    </MainLayout>
  );
};
