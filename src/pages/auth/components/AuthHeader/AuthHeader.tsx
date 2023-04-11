import React from 'react';
import { Button, Col, Dropdown, Layout, Menu, Row } from 'antd';
import { useNavigate } from 'react-router';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useResponsive } from 'ahooks';

import { Logo } from 'components/Logo/Logo';
import { useAppDispatch, useAppSelector } from 'store';
import { signOut } from 'store/slices/account/accountSlice';
import { Roles } from 'constants/roles';

const { Header } = Layout;

export const AuthHeader = () => {
  const { firstName, lastName, role } = useAppSelector(state => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const responsive = useResponsive();
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
      <Row
        wrap={false}
        justify='space-between'
        align='middle'
        style={{ height: '100%', color: '#fff' }}
      >
        <Col>
          <Logo />
        </Col>
        {role && role !== Roles.Unauthorized && (
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
        )}
      </Row>
    </Header>
  );
};
