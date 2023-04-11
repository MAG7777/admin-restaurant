import { Content } from 'antd/lib/layout/layout';
import React from 'react';

import { MainLayout } from 'components/Layout/MainLayout';
import { PageTitles } from 'constants/pageTitles';

export const Hotels: React.FC = () => {
  return (
    <MainLayout pageTitle={PageTitles.hotels} aside={'Filters'}>
      <Content>Attractions</Content>
    </MainLayout>
  );
};
