import React from 'react';
import { Layout } from 'antd';

import { AuthHeader } from '../AuthHeader/AuthHeader';
import styles from './AuthLayout.module.css';

type TProps = {
  children: React.ReactNode;
};
export const AuthLayout: React.FC<TProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <AuthHeader />
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div className={styles.content}>{children}</div>
      </Layout>
    </div>
  );
};
