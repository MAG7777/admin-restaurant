import React from 'react';
import { Button, Dropdown, Image, Menu, Tag, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { IResortItem } from 'store/slices/resorts/interfaces';
import { CommonTable } from 'components/CommonTable/CommonTable';
import { getImageUrl } from 'utils/image';
import { statusesColorsHash, statusesNamesHash } from 'constants/status';
import { makeAddressString } from 'utils/entities';

interface IProps {
  data: IResortItem[];
  total: number;
  limit?: number;
  getActions: (item: IResortItem) => Array<
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
      sorter: true,
      dataIndex: 'name',
      render: (text, item) => (
        <Typography>
          <Link
            style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
            to={`/resorts/${item.id}`}
          >
            <div style={{ flexShrink: 0 }}>
              <Image
                width={50}
                height={50}
                preview={false}
                src={
                  item?.image
                    ? getImageUrl(item.image, 50, 50) ||
                      '/public/images/no-image.svg'
                    : '/public/images/no-image.svg'
                }
                fallback='/public/images/no-image.svg'
                style={{ flexShrink: 0 }}
              />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <div>{(text && text.trim()) || 'Без названия'}</div>
              {item.address && (
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#8C8C8C',
                  }}
                >
                  {item.address?.region?.name} -{' '}
                  {makeAddressString({ city: item.address?.city }) ||
                    makeAddressString({ settlement: item.address?.settlement })}
                </div>
              )}
            </div>
          </Link>
        </Typography>
      ),
    },
    {
      key: 2,
      width: '20%',
      title: 'Автор',
      sorter: true,
      dataIndex: 'authorData',
      render: author => (
        <Typography>
          {author.lastName} {author.firstName}
        </Typography>
      ),
    },
    {
      key: 3,
      width: '20%',
      title: 'Статус',
      dataIndex: 'status',
      render: status => (
        <Tag color={statusesColorsHash[status]}>
          {statusesNamesHash[status]}
        </Tag>
      ),
    },
    {
      key: 4,
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
