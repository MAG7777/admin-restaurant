import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { appRoutes } from './appRoutes';

export const AppRouter: React.FC = () => {
  const app = useRoutes(appRoutes);
  return (
    <Suspense>
      <>{app}</>
    </Suspense>
  );
};
