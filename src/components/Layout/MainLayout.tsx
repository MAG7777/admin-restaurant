import React from 'react';
import { Layout } from 'antd';
import { configResponsive, useResponsive, useClickAway } from 'ahooks';
import classNames from 'classnames';

import { MainHeader } from './MainHeader/MainHeader';
import { Sidebar } from './Sidebar/Sidebar';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import styles from './MainLayout.module.less';
// import { PageAffix } from 'sport-backend/app/components/affix/affix';
// import { Breadcrumbs } from './components/Breadcrumbs';
// import { ContentEditBlock } from 'sport-backend/app/ant/components/ContentEditBlock';

configResponsive({
  small: 0,
  middle: 800,
  large: 1400,
  extraLarge: 1800,
});

type TProps = {
  pageTitle: string;
  subTitle?: string;
  children: React.ReactNode;
  extraButtonsList?: React.ReactNode[];
  aside?: React.ReactNode;
};

export const MainLayout: React.FC<TProps> = ({
  children,
  pageTitle,
  subTitle,
  extraButtonsList,
  aside = null,
}) => {
  const responsive = useResponsive();
  const [sidebarCollapsedStatus, setSidebarCollapsedStatus] =
    React.useState(false);
  const onCollapse = (status = null) => {
    setSidebarCollapsedStatus(prev =>
      typeof status === 'boolean' ? status : !prev
    );
  };
  useClickAway(event => {
    const target = event.target as HTMLElement;
    const sidebar = target.closest('.ant-layout-sider');
    const header = target.closest('.ant-layout-header');
    const headerBtn = target.closest('.ant-header-btn');
    if (!responsive.middle && !sidebar && !header && !headerBtn) {
      return onCollapse(true);
    }
    if (!responsive.middle && headerBtn && sidebarCollapsedStatus) {
      return onCollapse(true);
    }
  }, []);
  const sidebarWidth = responsive.middle
    ? sidebarCollapsedStatus
      ? '80'
      : '255'
    : 0;
  return (
    <Layout
      style={{
        // fixed header
        paddingTop: '64px',
        // fixed sidebar
        paddingLeft: `${sidebarWidth}px`,
        transition: 'all .5s',
        maxWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      <MainHeader
        showSideBar={sidebarCollapsedStatus}
        baseURL={'/'}
        onCollapse={onCollapse}
      />
      <Sidebar
        sidebarCollapsedStatus={sidebarCollapsedStatus}
        onCollapse={onCollapse}
      />
      <Layout style={{ width: '100%' }}>
        <Breadcrumbs
          subTitle={subTitle}
          pageTitle={pageTitle}
          extraButtonsList={extraButtonsList}
        />

        <div
          style={{
            padding: 24,
            position: 'relative',
          }}
        >
          <div
            className={classNames(styles.wrapper, {
              [styles.isMobile]: !responsive.large,
            })}
          >
            <div className={styles.main}>{children}</div>
            <div className={styles.aside}>{aside}</div>
          </div>
        </div>
      </Layout>
    </Layout>
  );
};
