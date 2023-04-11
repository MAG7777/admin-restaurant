import React from 'react';

import { Add } from './Add';
import { Edit } from './Edit';
import { List } from './List';
import { View } from './View';

export const resortsRoutes = {
  path: '/resorts',
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
    {
      path: ':id',
      element: <View />,
    },
  ],
};
