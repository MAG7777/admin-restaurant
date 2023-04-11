import React from 'react';
import { Navigate } from 'react-router';

import { useAppSelector } from 'store';
import { Role, Roles } from 'constants/roles';

import isAllowedRole from '../guards/role.guard';

type TProps = {
  children: React.ReactNode;
  allowedRoles?: Array<Role>;
};

export const ProtectedRoute: React.FC<TProps> = props => {
  const { children, allowedRoles } = props;

  const role = useAppSelector(state => state.account.role);
  const isAllowedToVisit = (): boolean => {
    if (allowedRoles && allowedRoles.length) {
      return isAllowedRole(role, allowedRoles);
    }
    if (!role || role === Roles.Unauthorized || role === Roles.Guest) {
      return false;
    } else {
      return true;
    }
  };

  if (isAllowedToVisit()) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  /** Если пользователь залогинен, но еще не получил роль
   * переместить его на заглушку ожидания роли
   */
  if (role === Roles.Guest) {
    return <Navigate replace to='/waiting-for-role' />;
    /**
     * Иначе же, если навигация недоступна и пользователь незалогинен,
     * Переадресовать на страницу логина
     */
  } else return <Navigate to='/login' />;
};
