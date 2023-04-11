import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation } from 'react-router';
import {
  BookOutlined,
  CalendarOutlined,
  CommentOutlined,
  EnvironmentOutlined,
  NodeIndexOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { useResponsive } from 'ahooks';
import { Link } from 'react-router-dom';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { PageTitles } from 'constants/pageTitles';

const { Sider } = Layout;

const sidebarList = [
  {
    key: 'places',
    label: 'Места',
    icon: <EnvironmentOutlined />,
    children: [
      {
        key: '/attractions',
        label: <Link to='/attractions'>{PageTitles.attractions}</Link>,
      },
      {
        key: '/resorts',
        label: <Link to='/resorts'>{PageTitles.resorts}</Link>,
      },
      {
        key: '/hotels',
        label: <Link to='/hotels'>{PageTitles.hotels}</Link>,
      },
      {
        key: '/restaurants',
        label: <Link to='/restaurants'>{PageTitles.restaurants}</Link>,
      },
    ],
  },
  {
    key: 'publications',
    label: 'Публикации',
    icon: <PictureOutlined />,
    children: [
      {
        key: '/news',
        label: <Link to='/news'>{PageTitles['news']}</Link>,
      },
      {
        key: '/articles',
        label: <Link to='/articles'>{PageTitles['articles']}</Link>,
      },
    ],
  },
  {
    key: '/touristRoutes',
    label: <Link to='/touristRoutes'>{PageTitles['touristRoutes']}</Link>,
    icon: <NodeIndexOutlined />,
  },
  {
    key: '/faq',
    label: <Link to='/faq'>{PageTitles.faq}</Link>,
    icon: <CommentOutlined />,
  },
  {
    key: '/events',
    label: <Link to='/events'>{PageTitles['events']}</Link>,
    icon: <CalendarOutlined />,
  },
  {
    key: 'directories',
    label: 'Справочники',
    icon: <BookOutlined />,
    children: [
      {
        key: '/catalog',
        label: <Link to='/catalog'>{PageTitles['catalog']}</Link>,
      },
    ],
  },
];

type TProps = {
  sidebarCollapsedStatus: boolean;
  onCollapse: () => any;
};
// eslint-disable-next-line react/prop-types
export const Sidebar: React.FC<TProps> = React.memo(
  ({ sidebarCollapsedStatus, onCollapse }) => {
    const responsive = useResponsive();
    const location = useLocation();
    const [activeTab, setActiveTab] = React.useState(null);
    const [activeGroupTab, setActiveGroupTab] = React.useState(null);

    React.useEffect(() => {
      /**
       это выбор активного раздела в sidebar
       **/
      const basePathname = location.pathname.split('/').slice(0, 2).join('/');
      sidebarList.map(item => {
        if (item.children) {
          const activeItem = item.children.find(
            nestedItem => nestedItem.key === basePathname
          );
          if (activeItem) {
            setActiveGroupTab(item.key);
          }
        }
      });
      setActiveTab(basePathname);
      // !responsive.middle && onCollapse(true);
    }, [location?.pathname]);
    return (
      <Sider
        className={classNames({
          '__ant-layout-sider-hide':
            !responsive.middle && sidebarCollapsedStatus,
          '__ant-layout-sider-show':
            !responsive.middle && !sidebarCollapsedStatus,
          '__ant-layout-sider-mobile': !responsive.middle,
        })}
        collapsed={sidebarCollapsedStatus}
        collapsible={responsive.middle}
        onCollapse={() => onCollapse()}
        width={'255px'}
      >
        {activeTab !== null && (
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={[activeTab]}
            defaultOpenKeys={[activeGroupTab]}
            items={sidebarList as ItemType[]}
          />
        )}
      </Sider>
    );
  },
  () => false
);

Sidebar.displayName = 'Sidebar';
