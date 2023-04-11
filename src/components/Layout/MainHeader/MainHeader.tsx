/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown, Button, Menu, Row, Col, Typography, Layout } from 'antd';
import {
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from 'ahooks';

import { useAppDispatch, useAppSelector } from 'store';
import { Logo } from 'components/Logo/Logo';
import { signOut } from 'store/slices/account/accountSlice';

const { Header } = Layout;

type TProps = {
  baseURL: string;
  showSideBar: boolean;
  onCollapse: () => any;
};

export const MainHeader: React.FC<TProps> = ({
  baseURL = '/',
  showSideBar = false,
  onCollapse,
}) => {
  const { firstName, lastName } = useAppSelector(state => state.account);
  const responsive = useResponsive();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };
  const dropDownMenu = (
    <Menu>
      <Menu.Item key='0'>
        <div onClick={handleSignOut}>Выйти</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header>
      <Row wrap={false} justify='space-between' style={{ height: '100%' }}>
        <Col
          flex='1'
          style={{
            minWidth: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            gap: '9px',
          }}
        >
          {!responsive?.middle && (
            <Button
              type={'link'}
              onClick={() => onCollapse()}
              icon={
                !showSideBar ? (
                  <MenuFoldOutlined
                    className={'ant-header-btn'}
                    style={{
                      fontSize: '35px',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  />
                ) : (
                  <MenuUnfoldOutlined
                    className={'ant-header-btn'}
                    style={{
                      fontSize: '35px',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  />
                )
              }
            />
          )}
          <Link to={baseURL}>
            <Typography.Text style={{ marginLeft: '13px' }} className={'logo'}>
              {responsive?.middle && <Logo />}
            </Typography.Text>
          </Link>
        </Col>
        <Col
          flex='1'
          style={{
            minWidth: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <Dropdown
            arrow
            overlay={dropDownMenu}
            placement='bottomRight'
            trigger={['click']}
          >
            <Button
              onClick={e => e.preventDefault()}
              style={{ color: '#ffffff' }}
              type='link'
            >
              <UserOutlined style={{ marginRight: '1px' }} />
              {responsive?.middle
                ? `${lastName} ${firstName}`
                : `${lastName} ${firstName.substring(0, 1)}`}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};
