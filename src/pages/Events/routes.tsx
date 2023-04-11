import React from 'react';

import { Add } from './Add';
import { Edit } from './Edit';
import { List } from './List';

export const eventsRoutes = {
  path: '/events',
  children: [
    {
      path: '',
      element: <List />,
    },
    {
      path: 'add',
      element: <Add />,
    },
    {
      path: ':id/edit',
      element: <Edit />,
    },
  ],
};
