import { notification } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';

import { useQuery } from 'hooks/useQuery';
import { useAppDispatch } from 'store';
import { emailConfirm } from 'store/slices/account/actions';

export const EmailConfirm = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(
      emailConfirm({
        email: query.email as string,
        emailConfirmToken: query.emailConfirmToken as string,
        userType: query.userType as string,
      })
    )
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Email успешно подтвержден!',
        });
        navigate('/');
      })
      .catch(() => {
        notification.error({
          message: 'Ошибка при подтвеждении почты',
        });
        navigate('/email-is-send?skipTimer=true');
      });
  }, []);
  return <div>...загрузка</div>;
};
