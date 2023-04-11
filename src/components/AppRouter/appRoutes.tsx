import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router';

import { Login } from 'pages/auth/Login/Login';
import { PasswordResetRequest } from 'pages/auth/PasswordResetRequest/PasswordResetRequest';
import { PasswordResetConfirm } from 'pages/auth/PasswordResetConfirm/PasswordResetConfirm';
import { Registration } from 'pages/auth/Registration/Registration';
import { Hotels } from 'pages/Hotels/Hotels';
import { Restaurants } from 'pages/Restaurants/Restaurants';
import { WaitingForRole } from 'pages/auth/WaitingForRole/WaitingForRole';
import { catalogRoutes } from 'pages/Catalog/routes';
import { attractionsRoutes } from 'pages/Attractions/routes';
import { EmailConfirm } from 'pages/auth/EmailConfirm/EmailConfirm';
import { EmailIsSend } from 'pages/auth/EmailIsSend/EmailIsSend';
import { newsRoutes } from 'pages/News/routes';
import { articlesRoutes } from 'pages/Articles/routes';
import { faqRoutes } from 'pages/FAQ/routes';
import { touristRoutesRoutes } from 'pages/TouristRoutes/routes';
import { resortsRoutes } from 'pages/Resorts/routes';
import { eventsRoutes } from 'pages/Events/routes';

import { GuestRoute } from './customRoutes/guest';
import { ProtectedRoute } from './customRoutes/protected';

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/password-reset-request',
    element: <PasswordResetRequest />,
  },
  {
    path: '/password-reset-confirm',
    element: <PasswordResetConfirm />,
  },
  {
    path: '/registration',
    element: <Registration />,
  },
  {
    path: '/email-confirm',
    element: <EmailConfirm />,
  },
  {
    path: '/email-is-send',
    element: (
      <GuestRoute>
        <EmailIsSend />
      </GuestRoute>
    ),
  },
  {
    path: '/waiting-for-role',
    element: (
      <GuestRoute>
        <WaitingForRole />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate replace to='/attractions' />,
      },
      attractionsRoutes,
      resortsRoutes,
      {
        path: '/hotels',
        element: <Hotels />,
      },
      {
        path: '/restaurants',
        element: <Restaurants />,
      },
      newsRoutes,
      catalogRoutes,
      articlesRoutes,
      faqRoutes,
      touristRoutesRoutes,
      eventsRoutes,
    ],
  },
];
