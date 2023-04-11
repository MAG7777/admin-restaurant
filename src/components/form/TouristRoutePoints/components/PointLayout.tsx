import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Row, Tooltip, Typography } from 'antd';
import React from 'react';
import { Content as AntContent } from 'antd/lib/layout/layout';
import classNames from 'classnames';

import styles from './PointLayout.module.less';

type TProps = {
  children: React.ReactNode;
  mainTitle: string;
  subTitle: string;
  index: number;
  total: number;
  changePosFn: (prevIndex: number, nextIndex: number) => void;
  removePointFn: (index: number) => void;
  initialIsOpen: boolean;
  error: any;
};

export const PointLayout: React.FC<TProps> = React.forwardRef(
  (
    {
      children,
      mainTitle,
      subTitle,
      index,
      total,
      changePosFn,
      removePointFn,
      initialIsOpen,
      error,
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = React.useState(initialIsOpen);
    return (
      <Row className={styles.item}>
        <Tooltip title={error ? 'Проверьте правильность заполнения полей' : ''}>
          <Row
            className={classNames(styles.header, { [styles.error]: error })}
            justify='space-between'
            wrap={false}
          >
            <div
              className={styles.main}
              ref={ref}
              tabIndex={0}
              onClick={() => setIsOpen(!isOpen)}
            >
              {mainTitle && (
                <Typography.Title level={5} style={{ marginBottom: '5px' }}>
                  {mainTitle}
                </Typography.Title>
              )}
              <Typography.Text
                style={{
                  fontSize: '14px',
                  lineHeight: '22px',
                  fontWeight: 'normal',
                }}
              >
                {subTitle}
              </Typography.Text>
            </div>
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  changePosFn(index, index - 1);
                }}
                style={{ marginRight: '4px' }}
                icon={<ArrowUpOutlined />}
                disabled={index === 0}
              />
              <Button
                onClick={() => {
                  changePosFn(index, index + 1);
                }}
                style={{ marginRight: '16px' }}
                icon={<ArrowDownOutlined />}
                disabled={index + 1 >= total}
              />
              <Button
                style={{ marginRight: '4px' }}
                onClick={() => setIsOpen(!isOpen)}
                icon={isOpen ? <UpOutlined /> : <DownOutlined />}
              />
              <Popconfirm
                title='Вы хотите удалить точку маршрута?'
                onConfirm={() => removePointFn(index)}
                okText='Удалить'
                okButtonProps={{ danger: true }}
                cancelText='Отмена'
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </Row>
        </Tooltip>
        {isOpen && (
          <AntContent style={{ backgroundColor: '#f5f5f5', minWidth: 0 }}>
            {children}
          </AntContent>
        )}
      </Row>
    );
  }
);

PointLayout.displayName = 'PointLayout';
