import React from 'react';
import { Button, Dropdown, Menu, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { entityTypeNames, fieldTypeNames } from 'constants/catalog';
import { ICatalogItem } from 'store/slices/catalog/interfaces';
import { CommonTable } from 'components/CommonTable/CommonTable';

interface IProps {
  data: ICatalogItem[];
  total: number;
  limit?: number;
  getActions: (item: ICatalogItem) => Array<
    | {
        element: JSX.Element;
        handler?: undefined;
      }
    | {
        element: React.ReactNode;
        handler: () => void;
      }
  >;
  setSort: (sort?: string) => void;
}

export const ListTable = ({
  data,
  total,
  limit = 20,
  getActions,
  setSort,
}: IProps) => {
  const columns = [
    {
      key: 1,
      title: 'Название',
      dataIndex: 'name',
      sorter: true,
      render: name => <Typography>{name}</Typography>,
    },
    {
      key: 3,
      width: '20%',
      title: 'Название сущности',
      dataIndex: 'entityType',
      render: entityName => (
        <Typography>{entityTypeNames[entityName]}</Typography>
      ),
    },
    {
      key: 4,
      width: '20%',
      title: 'Тип поля',
      dataIndex: 'fieldType',
      render: fieldType => <Typography>{fieldTypeNames[fieldType]}</Typography>,
    },
    {
      key: 5,
      title: '',
      width: 65,
      dataIndex: 'actions',
      fixed: 'right' as const,
      render: (actions, item) => {
        const dropMenu = (
          <Menu>
            {getActions &&
              getActions(item).map((action, index) =>
                action ? (
                  <Menu.Item key={index} onClick={action.handler}>
                    {action.element}
                  </Menu.Item>
                ) : null
              )}
          </Menu>
        );
        return (
          <>
            <Dropdown
              placement='bottomRight'
              overlay={dropMenu}
              arrow
              trigger={['click']}
            >
              <Button type='text' icon={<SettingOutlined />} />
            </Dropdown>
          </>
        );
      },
    },
  ];
  return (
    <>
      <CommonTable
        columns={columns}
        scroll={{ x: 800 }}
        dataSource={data}
        total={total}
        limit={limit}
        setSort={setSort}
      />
    </>
  );
};
