import React from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAppSelector } from 'store';
import { Roles } from 'constants/roles';

type TProps = {
  children: React.ReactNode;
};

export const GuestRoute: React.FC<TProps> = props => {
  const { children } = props;
  const location = useLocation();

  const { role, isEmailConfirmed } = useAppSelector(state => state.account);

  if (role === Roles.Guest) {
    if (isEmailConfirmed) {
      if (location.pathname === '/waiting-for-role') {
        return <React.Fragment>{children}</React.Fragment>;
      } else {
        return <Navigate to='/waiting-for-role' />;
      }
    }
    if (location.pathname === '/email-is-send') {
      return <React.Fragment>{children}</React.Fragment>;
    } else {
      return <Navigate to='/email-is-send?skipTimer=true' />;
    }
  } else {
    return <Navigate to='/' />;
  }
};
